import { Injectable } from '@angular/core';
import { ContractService } from '../contract/contract.service';
import { LoanRequest } from '../../interfaces/loan.interface';
import { APP_CONSTANTS } from '../../constants/app.constants';

declare global {
  interface Window { ethereum?: any; }
}

@Injectable({
  providedIn: 'root'
}
)
export class LoanService {
  private loans: LoanRequest[] = [];
  private readonly STORAGE_KEY = 'microtrust_loans';

  constructor(private contractService: ContractService) { 
    // Cargar préstamos del almacenamiento local al iniciar
    this.loadLoansFromStorage();
  }

  // Cargar préstamos del almacenamiento local
  private loadLoansFromStorage() {
    try {
      const storedLoans = localStorage.getItem(this.STORAGE_KEY);
      if (storedLoans) {
        this.loans = JSON.parse(storedLoans);
        // Convertir fechas de string a Date objects
        this.loans.forEach(loan => {
          if (loan.createdAt && typeof loan.createdAt === 'string') {
            loan.createdAt = new Date(loan.createdAt);
          }
          if (loan.approvedAt && typeof loan.approvedAt === 'string') {
            loan.approvedAt = new Date(loan.approvedAt);
          }
        });
      }
    } catch (error) {
      console.error('Error al cargar préstamos del almacenamiento local:', error);
      this.loans = [];
    }
  }

  // Guardar préstamos en el almacenamiento local
  private saveLoansToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.loans));
    } catch (error) {
      console.error('Error al guardar préstamos en el almacenamiento local:', error);
    }
  }

  // Calcular tasa de interés según propósito
  calculateInterestRate(purposeType: string): number {
    switch (purposeType) {
      case 'student': return APP_CONSTANTS.PURPOSE_TYPES.STUDENT.interestRate;
      case 'business': return APP_CONSTANTS.PURPOSE_TYPES.BUSINESS.interestRate;
      default: return APP_CONSTANTS.PURPOSE_TYPES.OTHER.interestRate;
    }
  }

  // Obtener límite de préstamo según red
  getLoanLimit(network: string): number {
    switch (network) {
      case 'goerli':
        return APP_CONSTANTS.NETWORKS.GOERLI.limit; // 3 ETH
      case 'holesky':
        return APP_CONSTANTS.NETWORKS.HOLESKY.limit; // 10 ETH
      case 'sepolia':
        return APP_CONSTANTS.NETWORKS.SEPOLIA.limit; // 5 ETH
      case 'hoodi':
        return APP_CONSTANTS.NETWORKS.HOODI.limit; // 8 ETH
      case 'ephemery':
        return APP_CONSTANTS.NETWORKS.EPHEMERY.limit; // 3 ETH
      default:
        return 0;
    }
  }

  // Crear una nueva solicitud de préstamo
  createLoanRequest(request: Omit<LoanRequest, 'id' | 'status' | 'createdAt' | 'totalAmountToPay'>): LoanRequest {
    // Calcular el monto total a pagar (monto + interés)
    const totalAmountToPay = request.amount + (request.amount * request.interestRate);
    
    const newLoan: LoanRequest = {
      id: this.generateId(),
      ...request,
      totalAmountToPay: totalAmountToPay, // Monto que debe devolver el prestatario
      status: 'pending',
      createdAt: new Date()
    };
    
    this.loans.push(newLoan);
    this.saveLoansToStorage(); // Guardar en almacenamiento local
    
    console.log(`💰 Préstamo creado:
    - Monto a recibir: ${request.amount} ETH
    - Interés (${(request.interestRate * 100).toFixed(0)}%): ${(request.amount * request.interestRate).toFixed(4)} ETH
    - Total a devolver: ${totalAmountToPay.toFixed(4)} ETH
    - Ganancia del admin: ${(request.amount * request.interestRate).toFixed(4)} ETH`);
    
    return newLoan;
  }

  // Obtener todas las solicitudes de préstamo
  getAllLoans(): LoanRequest[] {
    return [...this.loans];
  }

  // Obtener solicitudes por dirección de prestatario
  getLoansByBorrower(address: string): LoanRequest[] {
    return this.loans.filter(loan => loan.borrowerAddress === address);
  }

  // Obtener solicitudes pendientes (para administradores)
  getPendingLoans(): LoanRequest[] {
    return this.loans.filter(loan => loan.status === 'pending');
  }

  // Aprobar un préstamo (solo administradores)
  async approveLoan(loanId: string, adminAddress: string): Promise<{ success: boolean; message: string }> {
    if (!this.isAdmin(adminAddress)) {
      throw new Error('Solo los administradores pueden aprobar préstamos');
    }
    
    const loan = this.loans.find(l => l.id === loanId);
    if (loan) {
      // Registrar el administrador que aprobó el préstamo
      loan.approvedBy = adminAddress;
      // Cambiar estado a "pago pendiente" mientras se procesa la transacción
      loan.status = 'payment_pending';
      loan.approvedAt = new Date();
      this.saveLoansToStorage();
      
      try {
        // Intentar enviar el monto a través de MetaMask
        const txHash = await this.sendEthToBorrower(loan);
        
        // Cambiar estado a "disbursed" (desembolsado) con hash de transacción
        loan.status = 'disbursed';
        loan.events = (loan.events || '') + `\nTransacción enviada: ${txHash}\nEstado: Esperando confirmación en blockchain`;
        
        console.log('✅ Transacción enviada, esperando confirmación en blockchain...');
        
        // Iniciar seguimiento de la transacción
        this.trackTransactionConfirmation(loan, txHash);
        
        // Generar contrato inmediatamente (no esperar confirmación)
        try {
          loan.contractUrl = await this.contractService.generateContract(loan);
          console.log(`📄 Contrato generado: ${loan.contractUrl}`);
        } catch (contractError) {
          console.error('❌ Error al generar contrato:', contractError);
          loan.contractUrl = '#';
        }
        
        this.saveLoansToStorage();
        
        return { 
          success: true, 
          message: `Transacción enviada exitosamente! Hash: ${txHash}\n\n🚀 La transacción está siendo procesada en blockchain. El estado se actualizará automáticamente cuando se confirme.\n\n⏱️ Tiempo esperado: 15-60 segundos\n✅ Con gas price optimizado para confirmación rápida` 
        };
      } catch (error: any) {
        console.error('Error al enviar monto a través de MetaMask:', error);
        
        // Si el usuario cancela la transacción, mantener el estado "pago pendiente"
        if (error.code === 4001) { // Código de error cuando el usuario rechaza la transacción
          loan.status = 'payment_pending';
          this.saveLoansToStorage();
          return { success: false, message: 'Transacción cancelada por el usuario. El préstamo está pendiente de pago.' };
        } else {
          // Para otros errores, mantener el estado "pago pendiente"
          loan.status = 'payment_pending';
          this.saveLoansToStorage();
          return { success: false, message: `Error al enviar el monto: ${error.message || 'Error desconocido'}` };
        }
      }
    }
    return { success: false, message: 'Préstamo no encontrado' };
  }

  // Enviar ETH al prestatario a través de MetaMask
  // ⚠️ IMPORTANTE: El admin envía el MONTO COMPLETO solicitado (loan.amount)
  // El interés NO se descuenta aquí. El admin "presta" su dinero.
  // El admin recuperará su inversión + ganará el interés cuando el cliente devuelva el préstamo.
  private async sendEthToBorrower(loan: LoanRequest): Promise<string> {
    console.log(`🚀 Iniciando envío del MONTO COMPLETO: ${loan.amount} ETH a ${loan.borrowerAddress}`);
    console.log(`📊 Cliente recibirá: ${loan.amount} ETH (sin descuentos)`);
    console.log(`💰 Cliente deberá devolver: ${loan.totalAmountToPay.toFixed(4)} ETH`);
    console.log(`💵 Ganancia del admin: ${(loan.totalAmountToPay - loan.amount).toFixed(4)} ETH`);
    
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado. Por favor, instala MetaMask para continuar.');
    }
    
    try {
      // Verificar que MetaMask esté conectado
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('MetaMask no está conectado. Por favor, conecta tu wallet.');
      }
      
      const fromAddress = accounts[0];
      console.log(`💰 Enviando desde (Admin): ${fromAddress}`);
      console.log(`🎯 Enviando hacia (Cliente): ${loan.borrowerAddress}`);
      
      // ✅ Convertir el MONTO COMPLETO a Wei (sin descuentos de interés)
      const amountInWei = BigInt(Math.floor(loan.amount * 1e18));
      const amountInHex = '0x' + amountInWei.toString(16);
      
      console.log(`💎 Monto: ${loan.amount} ETH = ${amountInWei.toString()} Wei = ${amountInHex}`);
      
      // 🚀 OPTIMIZACIÓN: Usar EIP-1559 para transacciones MÁS RÁPIDAS
      try {
        // Obtener base fee del bloque actual
        const block = await window.ethereum.request({ 
          method: 'eth_getBlockByNumber',
          params: ['latest', false]
        });
        
        const baseFeePerGas = BigInt(block.baseFeePerGas || '0x0');
        
        // Calcular maxFeePerGas (base fee * 2 para asegurar inclusión rápida)
        const maxFeePerGas = baseFeePerGas * 2n;
        
        // Prioridad ALTA para mineros (5 Gwei)
        const maxPriorityFeePerGas = BigInt(5 * 1e9); // 5 Gwei = transacción rápida
        
        console.log(`⛽ Base Fee: ${Number(baseFeePerGas) / 1e9} Gwei`);
        console.log(`🚀 Max Fee: ${Number(maxFeePerGas) / 1e9} Gwei`);
        console.log(`💨 Priority Fee: ${Number(maxPriorityFeePerGas) / 1e9} Gwei (RÁPIDA)`);
        
        // Parámetros de la transacción con EIP-1559
        const transactionParameters: any = {
          to: loan.borrowerAddress,
          from: fromAddress,
          value: amountInHex,
          gas: '0x5208', // 21000 gas (transferencia simple)
          maxFeePerGas: '0x' + maxFeePerGas.toString(16),
          maxPriorityFeePerGas: '0x' + maxPriorityFeePerGas.toString(16)
        };
        
        console.log('📋 Parámetros de transacción (EIP-1559):', transactionParameters);
        console.log('⏳ Esperando confirmación del usuario en MetaMask...');
        
        // Solicitar la transacción a MetaMask
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        
        return txHash;
        
      } catch (eip1559Error) {
        // Fallback: Si EIP-1559 no es soportado, usar gas price legacy
        console.warn('⚠️ EIP-1559 no soportado, usando gas price legacy...');
        
        const currentGasPrice = await window.ethereum.request({ 
          method: 'eth_gasPrice' 
        });
        
        // Agregar 50% de margen para MÁXIMA prioridad
        const gasPriceWithMargin = BigInt(currentGasPrice) * 150n / 100n;
        const gasPriceHex = '0x' + gasPriceWithMargin.toString(16);
        
        console.log(`⛽ Gas Price (mercado): ${parseInt(currentGasPrice, 16) / 1e9} Gwei`);
        console.log(`🚀 Gas Price (con +50%): ${Number(gasPriceWithMargin) / 1e9} Gwei`);
        
        const transactionParameters = {
          to: loan.borrowerAddress,
          from: fromAddress,
          value: amountInHex,
          gas: '0x5208',
          gasPrice: gasPriceHex
        };
        
        console.log('📋 Parámetros de transacción (Legacy):', transactionParameters);
        console.log('⏳ Esperando confirmación del usuario en MetaMask...');
        
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        
        return txHash;
      }
      
    } catch (error: any) {
      console.error('❌ Error al enviar transacción:', error);
      console.log('✅ Transacción procesada');
      console.log(`🌐 Ver en explorador: https://${loan.network}.etherscan.io/tx/`);
      
      // Manejar diferentes tipos de errores
      if (error.code === 4001) {
        throw new Error('Transacción cancelada por el usuario en MetaMask.');
      } else if (error.code === -32603) {
        throw new Error('Error interno de MetaMask. Verifica tu conexión y saldo.');
      } else if (error.message?.includes('insufficient funds')) {
        throw new Error('Fondos insuficientes en tu wallet para enviar la transacción.');
      } else {
        throw new Error(`Error de MetaMask: ${error.message || 'Error desconocido'}`);
      }
    }
  }

  // Pagar un préstamo (por parte del prestatario)
  async payLoan(loanId: string, borrowerAddress: string): Promise<{ success: boolean; message: string }> {
    const loan = this.loans.find(l => l.id === loanId);
    
    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }
    
    // Verificar que el solicitante sea el propietario del préstamo
    if (loan.borrowerAddress.toLowerCase() !== borrowerAddress.toLowerCase()) {
      throw new Error('No tienes permiso para pagar este préstamo');
    }
    
    // Verificar que el préstamo esté aprobado
    if (loan.status !== 'approved') {
      throw new Error('El préstamo debe estar aprobado para poder ser pagado');
    }
    
    // Usar el monto total ya calculado (monto + interés)
    const totalAmount = loan.totalAmountToPay;
    const interestAmount = totalAmount - loan.amount;
    
    console.log(`💳 Pago de préstamo:
    - Monto original: ${loan.amount} ETH
    - Interés: ${interestAmount.toFixed(4)} ETH
    - Total a pagar: ${totalAmount.toFixed(4)} ETH
    - Ganancia del admin: ${interestAmount.toFixed(4)} ETH`);
    
    try {
      // Intentar enviar el monto total al administrador que aprobó el préstamo
      await this.sendEthToLender(loan, totalAmount);
      
      // Si la transacción es exitosa, cambiar el estado a "paid"
      loan.status = 'paid';
      this.saveLoansToStorage();
      
      return { success: true, message: 'Préstamo pagado correctamente' };
    } catch (error: any) {
      console.error('Error al pagar el préstamo a través de MetaMask:', error);
      
      // Si el usuario cancela la transacción, mantener el estado "approved"
      if (error.code === 4001) { // Código de error cuando el usuario rechaza la transacción
        return { success: false, message: 'Transacción cancelada por el usuario. El préstamo no ha sido pagado.' };
      } else {
        // Para otros errores
        return { success: false, message: `Error al pagar el préstamo: ${error.message || 'Error desconocido'}` };
      }
    }
  }

  // Enviar ETH al prestamista a través de MetaMask
  private async sendEthToLender(loan: LoanRequest, amount: number): Promise<void> {
    console.log(`🔄 Iniciando pago de ${amount} ETH para préstamo ${loan.id}`);
    
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado. Por favor, instala MetaMask para continuar.');
    }
    
    try {
      // Verificar que MetaMask esté conectado
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('MetaMask no está conectado. Por favor, conecta tu wallet.');
      }
      
      const fromAddress = accounts[0];
      
      // Determinar dirección del prestamista
      let lenderAddress: string;
      if (loan.approvedBy) {
        lenderAddress = loan.approvedBy;
        console.log(`💼 Enviando pago al admin que aprobó: ${lenderAddress}`);
      } else {
        if (APP_CONSTANTS.ADMIN_ADDRESSES.length > 0) {
          lenderAddress = APP_CONSTANTS.ADMIN_ADDRESSES[0];
          console.warn(`⚠️ Usando admin por defecto: ${lenderAddress}`);
        } else {
          throw new Error('No hay administradores registrados en el sistema');
        }
      }
      
      console.log(`💰 Pagando desde: ${fromAddress}`);
      console.log(`🎯 Pagando hacia: ${lenderAddress}`);
      
      // Convertir ETH a Wei usando BigInt para evitar problemas de precisión
      const amountInWei = BigInt(Math.floor(amount * 1e18));
      const amountInHex = '0x' + amountInWei.toString(16);
      
      console.log(`💎 Monto total: ${amount} ETH = ${amountInWei.toString()} Wei = ${amountInHex}`);
      
      // 🚀 OPTIMIZACIÓN: Obtener gas price dinámico del mercado
      const currentGasPrice = await window.ethereum.request({ 
        method: 'eth_gasPrice' 
      });
      
      // Agregar 20% de margen para priorizar la transacción
      const gasPriceWithMargin = BigInt(currentGasPrice) * 120n / 100n;
      const gasPriceHex = '0x' + gasPriceWithMargin.toString(16);
      
      console.log(`⛽ Gas Price (mercado): ${parseInt(currentGasPrice, 16) / 1e9} Gwei`);
      console.log(`⛽ Gas Price (con +20%): ${Number(gasPriceWithMargin) / 1e9} Gwei`);
      
      // Parámetros de la transacción
      const transactionParameters = {
        to: lenderAddress,
        from: fromAddress,
        value: amountInHex,
        gas: '0x5208', // 21000 gas (transferencia simple)
        gasPrice: gasPriceHex // ✅ Gas price dinámico
      };
      
      console.log('📋 Parámetros de pago:', transactionParameters);
      
      // Mostrar confirmación al usuario
      console.log('⏳ Esperando confirmación del pago en MetaMask...');
      
      // Solicitar la transacción a MetaMask
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      
      console.log('✅ Pago enviado exitosamente!');
      console.log('🔗 Hash de pago:', txHash);
      console.log(`🌐 Ver en explorador: https://${loan.network}.etherscan.io/tx/${txHash}`);
      
      // Guardar el hash de la transacción de pago en el préstamo
      loan.events = (loan.events || '') + `\nPago realizado: ${txHash}`;
      
    } catch (error: any) {
      console.error('❌ Error al enviar pago:', error);
      
      // Manejar diferentes tipos de errores
      if (error.code === 4001) {
        throw new Error('Pago cancelado por el usuario en MetaMask.');
      } else if (error.code === -32603) {
        throw new Error('Error interno de MetaMask. Verifica tu conexión y saldo.');
      } else if (error.message?.includes('insufficient funds')) {
        throw new Error('Fondos insuficientes en tu wallet para realizar el pago.');
      } else {
        throw new Error(`Error de MetaMask: ${error.message || 'Error desconocido'}`);
      }
    }
  }

  // Marcar préstamo como pagado
  markAsPaid(loanId: string, adminAddress: string): boolean {
    if (!this.isAdmin(adminAddress)) {
      throw new Error('Solo los administradores pueden marcar préstamos como pagados');
    }
    
    const loan = this.loans.find(l => l.id === loanId);
    if (loan && loan.status === 'approved') {
      loan.status = 'paid';
      this.saveLoansToStorage();
      return true;
    }
    return false;
  }

  // Rechazar un préstamo (solo administradores)
  rejectLoan(loanId: string, adminAddress: string, rejectionReason?: string): boolean {
    if (!this.isAdmin(adminAddress)) {
      throw new Error('Solo los administradores pueden rechazar préstamos');
    }
    
    const loan = this.loans.find(l => l.id === loanId);
    if (loan) {
      loan.status = 'rejected';
      loan.rejectedBy = adminAddress;
      loan.rejectedAt = new Date();
      loan.rejectionReason = rejectionReason || 'No se proporcionó un motivo específico';
      this.saveLoansToStorage(); // Guardar cambios
      return true;
    }
    return false;
  }

  // Limpiar todos los préstamos del almacenamiento local
  clearAllLoans(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.loans = [];
      console.log('✅ Todos los préstamos han sido eliminados del almacenamiento local');
    } catch (error) {
      console.error('❌ Error al limpiar los préstamos del almacenamiento local:', error);
    }
  }

  // Eliminar préstamos de prueba específicos (si existen)
  removeTestLoans(): void {
    const testAddresses = [
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321', 
      '0x1111111111111111111111111111111111111111'
    ];
    
    const initialCount = this.loans.length;
    this.loans = this.loans.filter(loan => 
      !testAddresses.includes(loan.borrowerAddress.toLowerCase())
    );
    
    const removedCount = initialCount - this.loans.length;
    if (removedCount > 0) {
      this.saveLoansToStorage();
      console.log(`✅ Eliminados ${removedCount} préstamos de prueba`);
    } else {
      console.log('ℹ️ No se encontraron préstamos de prueba para eliminar');
    }
  }

  // Verificar si una dirección es administrador
  isAdmin(address: string): boolean {
    // Comparación insensible a mayúsculas/minúsculas y formato de dirección
    if (!address) return false;
    
    const normalizedAddress = address.toLowerCase();
    const isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.some(adminAddress => 
      adminAddress.toLowerCase() === normalizedAddress
    );
    
    console.log(`Verificando admin: ${address} - Resultado: ${isAdmin}`);
    return isAdmin;
  }



  // Verificar configuración de MetaMask
  async checkMetaMaskSetup(): Promise<{ isReady: boolean; message: string }> {
    try {
      if (!window.ethereum) {
        return {
          isReady: false,
          message: 'MetaMask no está instalado. Por favor, instala MetaMask desde https://metamask.io'
        };
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        return {
          isReady: false,
          message: 'MetaMask no está conectado. Por favor, conecta tu wallet.'
        };
      }
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log(`🌐 Red actual: ${chainId}`);
      
      // Verificar balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });
      
      const balanceInEth = parseInt(balance, 16) / 1e18;
      console.log(`💰 Balance: ${balanceInEth} ETH`);
      
      if (balanceInEth < 0.001) {
        return {
          isReady: false,
          message: `Balance insuficiente: ${balanceInEth.toFixed(6)} ETH. Necesitas al menos 0.001 ETH para gas.`
        };
      }
      
      return {
        isReady: true,
        message: `MetaMask configurado correctamente. Balance: ${balanceInEth.toFixed(6)} ETH`
      };
      
    } catch (error: any) {
      return {
        isReady: false,
        message: `Error al verificar MetaMask: ${error.message || 'Error desconocido'}`
      };
    }
  }

  // Seguimiento de confirmación de transacción (OPTIMIZADO)
  private async trackTransactionConfirmation(loan: LoanRequest, txHash: string): Promise<void> {
    console.log(`🔍 Iniciando seguimiento de transacción ${txHash}...`);
    
    let attempts = 0;
    const maxAttempts = 12; // 12 intentos x 5s = 60 segundos máximo
    
    // 🚀 OPTIMIZACIÓN: Verificar cada 5 segundos (antes 30s)
    const checkInterval = setInterval(async () => {
      attempts++;
      
      try {
        const isConfirmed = await this.checkTransactionStatus(txHash, loan.network);
        
        if (isConfirmed) {
          console.log(`✅ Transacción ${txHash} confirmada en ${attempts * 5} segundos!`);
          
          // Actualizar estado del préstamo
          loan.status = 'approved';
          loan.events = (loan.events || '') + `\nTransacción confirmada: ${txHash}\nTiempo: ${attempts * 5}s\nEstado: Fondos transferidos exitosamente`;
          this.saveLoansToStorage();
          
          // Limpiar el intervalo
          clearInterval(checkInterval);
          
          // 🎉 OPTIMIZACIÓN: Notificación visual al usuario
          this.showTransactionConfirmedNotification(loan, txHash, attempts * 5);
          
          console.log(`🎉 Préstamo ${loan.id} confirmado en blockchain!`);
        } else if (attempts >= maxAttempts) {
          // ⚠️ OPTIMIZACIÓN: Detectar transacción demorada después de 60s
          console.warn(`⚠️ Transacción ${txHash} excedió el tiempo esperado (60s)`);
          clearInterval(checkInterval);
          
          // Notificar que está demorada pero seguir verificando en segundo plano
          this.showTransactionDelayedNotification(loan, txHash);
          
          // Continuar verificando pero con menor frecuencia (cada 15s)
          this.trackDelayedTransaction(loan, txHash);
        }
      } catch (error) {
        console.warn('⚠️ Error al verificar transacción:', error);
        
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
        }
      }
    }, 5000); // ✅ Verificar cada 5 segundos (antes 30s)
  }
  
  // Seguimiento de transacciones demoradas (después de 60s)
  private async trackDelayedTransaction(loan: LoanRequest, txHash: string): Promise<void> {
    console.log(`⏰ Iniciando seguimiento extendido para transacción ${txHash}...`);
    
    let extendedAttempts = 0;
    const maxExtendedAttempts = 20; // 20 x 15s = 5 minutos adicionales
    
    const checkInterval = setInterval(async () => {
      extendedAttempts++;
      
      try {
        const isConfirmed = await this.checkTransactionStatus(txHash, loan.network);
        
        if (isConfirmed) {
          const totalTime = 60 + (extendedAttempts * 15);
          console.log(`✅ Transacción ${txHash} finalmente confirmada después de ${totalTime}s`);
          
          loan.status = 'approved';
          loan.events = (loan.events || '') + `\nTransacción confirmada (demorada): ${txHash}\nTiempo total: ${totalTime}s`;
          this.saveLoansToStorage();
          
          clearInterval(checkInterval);
          this.showTransactionConfirmedNotification(loan, txHash, totalTime);
        } else if (extendedAttempts >= maxExtendedAttempts) {
          console.error(`❌ Transacción ${txHash} no confirmada después de 6 minutos`);
          clearInterval(checkInterval);
          this.showTransactionFailedNotification(loan, txHash);
        }
      } catch (error) {
        console.warn('⚠️ Error en verificación extendida:', error);
        if (extendedAttempts >= maxExtendedAttempts) {
      clearInterval(checkInterval);
        }
      }
    }, 15000); // Cada 15 segundos en modo extendido
  }
  
  // Notificación de transacción confirmada
  private showTransactionConfirmedNotification(loan: LoanRequest, txHash: string, timeInSeconds: number): void {
    // Disparar evento personalizado para que los componentes lo escuchen
    window.dispatchEvent(new CustomEvent('transaction-confirmed', {
      detail: {
        loan: loan,
        txHash: txHash,
        time: timeInSeconds,
        message: `✅ Transacción confirmada en ${timeInSeconds} segundos`
      }
    }));
    
    console.log(`📢 Notificación enviada: Transacción confirmada (${loan.id})`);
  }
  
  // Notificación de transacción demorada
  private showTransactionDelayedNotification(loan: LoanRequest, txHash: string): void {
    window.dispatchEvent(new CustomEvent('transaction-delayed', {
      detail: {
        loan: loan,
        txHash: txHash,
        message: `⚠️ La transacción está tardando más de 60 segundos. Seguimos verificando...`,
        explorerUrl: `https://${loan.network}.etherscan.io/tx/${txHash}`
      }
    }));
    
    console.log(`📢 Notificación enviada: Transacción demorada (${loan.id})`);
  }
  
  // Notificación de transacción fallida
  private showTransactionFailedNotification(loan: LoanRequest, txHash: string): void {
    window.dispatchEvent(new CustomEvent('transaction-failed', {
      detail: {
        loan: loan,
        txHash: txHash,
        message: `❌ La transacción no se confirmó después de 6 minutos`,
        explorerUrl: `https://${loan.network}.etherscan.io/tx/${txHash}`
      }
    }));
    
    console.log(`📢 Notificación enviada: Transacción fallida (${loan.id})`);
  }

  // Verificar estado de transacción en blockchain
  private async checkTransactionStatus(txHash: string, network: string): Promise<boolean> {
    try {
      if (!window.ethereum) {
        return false;
      }

      // Obtener recibo de la transacción
      const receipt = await window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      });

      // Si hay recibo, la transacción está confirmada
      if (receipt && receipt.status) {
        const isSuccess = receipt.status === '0x1';
        console.log(`📋 Recibo de transacción ${txHash}: ${isSuccess ? 'Exitosa' : 'Fallida'}`);
        return isSuccess;
      }

      return false;
    } catch (error) {
      console.warn('⚠️ No se pudo verificar transacción:', error);
      return false;
    }
  }

  // Generar ID único para préstamo
  private generateId(): string {
    return 'loan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  }
}