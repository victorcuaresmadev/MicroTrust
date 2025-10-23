import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { LoanService } from '../../services/loan/loan.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { PurposeTypeConfig, NetworkConfig } from '../../interfaces/loan.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loan-request',
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.css']
})
export class LoanRequestComponent implements OnInit {
  account: string | null = null;
  chainId: string | null = null;
  error: string | null = null;
  isLoading: boolean = false;
  isStudentVerified: boolean = false;
  studentVerificationData: any = null;
  
  // Formulario de solicitud
  loanForm = {
    borrowerName: '',
    amount: null as number | null,
    purpose: '',
    purposeType: 'other' as 'student' | 'business' | 'health' | 'events' | 'other',
    network: 'goerli' as 'goerli' | 'holesky' | 'sepolia' | 'ephemery',
    loanDuration: 7 as number // Duración del préstamo en días (por defecto 7 días)
  };
  
  // Información calculada
  interestRate: number = APP_CONSTANTS.PURPOSE_TYPES.OTHER.interestRate;
  finalInterestRate: number = APP_CONSTANTS.PURPOSE_TYPES.OTHER.interestRate; // Tasa final con descuento
  totalAmount: number = 0;
  loanLimit: number = 0; // Se actualizará en ngOnInit según la red por defecto
  hasDiscount: boolean = false; // Indica si tiene descuento por pago rápido
  discountPercentage: number = 0; // Porcentaje de descuento aplicado
  
  // Redes disponibles
  networks = [
    APP_CONSTANTS.NETWORKS.GOERLI,
    APP_CONSTANTS.NETWORKS.HOLESKY,
    APP_CONSTANTS.NETWORKS.SEPOLIA,
    APP_CONSTANTS.NETWORKS.EPHEMERY
  ];
  
  // Tipos de propósito
  purposeTypes = [
    APP_CONSTANTS.PURPOSE_TYPES.STUDENT,
    APP_CONSTANTS.PURPOSE_TYPES.BUSINESS,
    APP_CONSTANTS.PURPOSE_TYPES.HEALTH,
    APP_CONSTANTS.PURPOSE_TYPES.EVENTS,
    APP_CONSTANTS.PURPOSE_TYPES.OTHER
  ];
  
  // Opciones de duración del préstamo
  loanDurations = [
    { value: 7, label: '7 días' },
    { value: 15, label: '15 días' },
    { value: 30, label: '1 mes' },
    { value: 60, label: '2 meses' },
    { value: 90, label: '3 meses' }
  ];

  constructor(
    private wallet: WalletService,
    private loanService: LoanService
  ) {}
  
  ngOnInit() {
    this.updateInterestRate();
    this.updateLoanLimit(); // Establecer límite inicial según la red por defecto
    this.calculateFinalInterestRate(); // Calcular tasa final con descuentos
    this.checkStudentVerification();
    
    // Escuchar cambios en la verificación de estudiante (cuando se cierra la ventana)
    window.addEventListener('storage', (e) => {
      if (e.key === 'student_verification') {
        this.checkStudentVerification();
      }
    });
  }
  
  async connect() {
    this.error = null;
    this.isLoading = true; // Activamos el estado de carga
    try {
      const acc = await this.wallet.connect();
      this.account = acc;
      this.chainId = await this.wallet.getChainId();
      this.updateLoanLimit();
    } catch (e: any) {
      this.error = e?.message || String(e);
    } finally {
      this.isLoading = false; // Desactivamos el estado de carga
    }
  }
  
  updateInterestRate() {
    this.interestRate = this.loanService.calculateInterestRate(this.loanForm.purposeType);
    this.calculateTotalAmount();
  }
  
  updateLoanLimit() {
    // Actualizar límite según la red seleccionada
    this.loanLimit = this.loanService.getLoanLimit(this.loanForm.network);
    console.log(`Límite actualizado para ${this.loanForm.network}: ${this.loanLimit} ETH`);
  }
  
  calculateTotalAmount() {
    if (this.loanForm.amount) {
      // Calcular tasa final con descuento por pago rápido
      this.calculateFinalInterestRate();
      this.totalAmount = this.loanForm.amount + (this.loanForm.amount * this.finalInterestRate);
    } else {
      this.totalAmount = 0;
    }
  }
  
  calculateFinalInterestRate() {
    // Aplicar descuentos por pago rápido
    if (this.loanForm.loanDuration === 7) {
      // 7 días: 2.5% de descuento
      this.hasDiscount = true;
      this.discountPercentage = 2.5;
      this.finalInterestRate = this.interestRate * (1 - 0.025); // Reducir 2.5%
    } else if (this.loanForm.loanDuration === 15) {
      // 15 días: 3% de descuento
      this.hasDiscount = true;
      this.discountPercentage = 3;
      this.finalInterestRate = this.interestRate * (1 - 0.03); // Reducir 3%
    } else {
      // Sin descuento para otras duraciones
      this.hasDiscount = false;
      this.discountPercentage = 0;
      this.finalInterestRate = this.interestRate;
    }
  }
  
  onAmountChange() {
    this.calculateTotalAmount();
  }
  
  onDurationChange() {
    this.calculateTotalAmount();
  }
  
  onNetworkChange() {
    this.updateLoanLimit();
  }
  
  onPurposeTypeChange() {
    this.updateInterestRate();
    
    // Si selecciona estudiante y no está verificado, mostrar alerta
    if (this.loanForm.purposeType === 'student' && !this.isStudentVerified) {
      Swal.fire({
        title: '🎓 Verificación Requerida',
        html: `
          <div style="text-align: left; padding: 15px;">
            <p style="margin-bottom: 15px;">
              Para acceder a la tasa preferencial de <strong>estudiantes (12%)</strong>, 
              necesitas verificar tu condición de estudiante.
            </p>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>📋 Requisitos:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Correo institucional (&#64;MicroTrust.edu.pe)</li>
                <li>Código de estudiante</li>
                <li>Nombre de tu universidad</li>
                <li>Información de carrera</li>
              </ul>
            </div>
            <p style="color: #059669; margin-top: 15px;">
              ✓ El proceso solo toma 2 minutos
            </p>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '✓ Verificar Ahora',
        cancelButtonText: 'Más Tarde',
        confirmButtonColor: '#667eea'
      }).then((result) => {
        if (result.isConfirmed) {
          this.openStudentVerification();
        }
      });
    }
  }
  
  checkStudentVerification() {
    const verification = localStorage.getItem('student_verification');
    if (verification) {
      try {
        this.studentVerificationData = JSON.parse(verification);
        this.isStudentVerified = this.studentVerificationData.status === 'verified';
      } catch (error) {
        this.isStudentVerified = false;
        this.studentVerificationData = null;
      }
    } else {
      this.isStudentVerified = false;
      this.studentVerificationData = null;
    }
  }
  
  openStudentVerification() {
    // Abrir ventana de verificación
    const width = 800;
    const height = 700;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    const verificationWindow = window.open(
      '/verificacion-estudiante',
      'VerificacionEstudiante',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    if (!verificationWindow) {
      Swal.fire({
        title: '⚠️ Ventana Bloqueada',
        text: 'El navegador bloqueó la ventana de verificación. Por favor, permite ventanas emergentes e intenta nuevamente.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    } else {
      // Verificar periódicamente si se completó la verificación
      const checkInterval = setInterval(() => {
        if (verificationWindow.closed) {
          clearInterval(checkInterval);
          this.checkStudentVerification();
          
          if (this.isStudentVerified) {
            Swal.fire({
              title: '✅ Verificación Completada',
              text: 'Tu condición de estudiante ha sido verificada. Ahora tienes acceso a la tasa preferencial del 12%.',
              icon: 'success',
              confirmButtonText: '👍 Excelente',
              timer: 4000,
              timerProgressBar: true
            });
          }
        }
      }, 500);
    }
  }
  
  // Método para actualizar el tipo de propósito usando el objeto completo
  updatePurposeTypeWithType(type: PurposeTypeConfig) {
    // Verificamos que el valor sea uno de los tipos permitidos
    if (type.value === 'student' || type.value === 'business' || type.value === 'health' || type.value === 'events' || type.value === 'other') {
      this.loanForm.purposeType = type.value;
      this.onPurposeTypeChange();
    }
  }
  
  // Método para actualizar la red usando el objeto completo
  updateNetworkWithConfig(net: NetworkConfig) {
    // Verificamos que el valor sea uno de los tipos permitidos
    if (net.value === 'goerli' || net.value === 'holesky' || net.value === 'sepolia' || net.value === 'ephemery') {
      this.loanForm.network = net.value;
      this.onNetworkChange();
    }
  }
  
  async submitLoanRequest() {
    if (!this.account) {
      this.error = 'Debes conectar tu wallet primero';
      return;
    }
    
    // Validación de nombre completo (solo letras y espacios)
    if (!this.loanForm.borrowerName) {
      await Swal.fire({
        icon: 'error',
        title: 'Nombre Requerido',
        text: 'Debes ingresar tu nombre completo.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        customClass: {
          popup: 'swal-professional',
          confirmButton: 'swal-btn'
        }
      });
      return;
    }
    
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(this.loanForm.borrowerName)) {
      await Swal.fire({
        icon: 'error',
        title: 'Nombre Inválido',
        html: `
          <div style="text-align: left; padding: 1rem;">
            <p style="margin-bottom: 1rem;">El nombre completo solo puede contener:</p>
            <ul style="margin-left: 1.5rem; color: var(--text-secondary);">
              <li>Letras (a-z, A-Z)</li>
              <li>Letras con tildes (á, é, í, ó, ú)</li>
              <li>La letra ñ</li>
              <li>Espacios</li>
            </ul>
            <p style="margin-top: 1rem; color: #ef4444;">❌ No se permiten números ni caracteres especiales.</p>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        customClass: {
          popup: 'swal-professional swal-wide',
          confirmButton: 'swal-btn'
        }
      });
      return;
    }
    
    // Validación de monto
    if (!this.loanForm.amount || this.loanForm.amount <= 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Monto Inválido',
        text: 'El monto del préstamo debe ser mayor a 0 ETH.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        customClass: {
          popup: 'swal-professional',
          confirmButton: 'swal-btn'
        }
      });
      return;
    }
    
    // Validación de límite de red
    if (this.loanForm.amount > this.loanLimit) {
      await Swal.fire({
        icon: 'error',
        title: 'Monto Excede el Límite',
        html: `
          <div style="text-align: center; padding: 1rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
            <p style="font-size: 1.1rem; margin: 1rem 0;">No se puede enviar la solicitud porque el monto excede el límite permitido.</p>
            <div style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 1rem 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: var(--text-secondary);">Monto solicitado:</span>
                <span style="color: #ef4444; font-weight: 700; font-size: 1.2rem;">${this.loanForm.amount} ETH</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--text-secondary);">Límite de la red:</span>
                <span style="color: #10b981; font-weight: 700; font-size: 1.2rem;">${this.loanLimit} ETH</span>
              </div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem;">
              Por favor, reduce el monto a <strong>${this.loanLimit} ETH</strong> o menos, o cambia a una red con mayor límite.
            </p>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#f59e0b',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        customClass: {
          popup: 'swal-professional swal-wide',
          confirmButton: 'swal-btn swal-btn-warning'
        }
      });
      return;
    }
    
    // Validación de propósito (solo letras, números y espacios)
    if (!this.loanForm.purpose) {
      await Swal.fire({
        icon: 'error',
        title: 'Propósito Requerido',
        text: 'Debes especificar el propósito del préstamo.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        customClass: {
          popup: 'swal-professional',
          confirmButton: 'swal-btn'
        }
      });
      return;
    }
    
    const purposeRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:()¿?¡!-]+$/;
    if (!purposeRegex.test(this.loanForm.purpose)) {
      await Swal.fire({
        icon: 'error',
        title: 'Propósito Inválido',
        html: `
          <div style="text-align: left; padding: 1rem;">
            <p style="margin-bottom: 1rem;">El propósito del préstamo solo puede contener:</p>
            <ul style="margin-left: 1.5rem; color: var(--text-secondary);">
              <li>Letras (a-z, A-Z)</li>
              <li>Números (0-9)</li>
              <li>Letras con tildes (á, é, í, ó, ú)</li>
              <li>La letra ñ</li>
              <li>Espacios</li>
              <li>Signos de puntuación básicos (. , ; : - ¿ ? ¡ !)</li>
            </ul>
            <p style="margin-top: 1rem; color: #ef4444;">❌ No se permiten caracteres especiales como @, #, $, %, &, etc.</p>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        customClass: {
          popup: 'swal-professional swal-wide',
          confirmButton: 'swal-btn'
        }
      });
      return;
    }
    
    // Verificar si seleccionó estudiante y no está verificado
    if (this.loanForm.purposeType === 'student' && !this.isStudentVerified) {
      this.error = 'Debes verificar tu condición de estudiante antes de continuar';
      
      Swal.fire({
        title: '⚠️ Verificación Requerida',
        text: 'Para acceder a la tasa de estudiante, primero debes verificar tu condición de estudiante.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '✓ Verificar Ahora',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#667eea'
      }).then((result) => {
        if (result.isConfirmed) {
          this.openStudentVerification();
        }
      });
      
      return;
    }
    
    try {
      const loanRequest = this.loanService.createLoanRequest({
        borrowerName: this.loanForm.borrowerName,
        borrowerAddress: this.account,
        amount: this.loanForm.amount,
        purpose: this.loanForm.purpose,
        purposeType: this.loanForm.purposeType,
        network: this.loanForm.network,
        interestRate: this.finalInterestRate, // Usar tasa final con descuento
        loanDuration: this.loanForm.loanDuration
      });
      
      // Mostrar mensaje de éxito
      await Swal.fire({
        title: '¡Solicitud enviada!',
        text: 'Solicitud de préstamo enviada correctamente. Estamos procesando tu solicitud, en 24 horas se reflejará en tu cuenta.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      
      // Limpiar formulario
      this.loanForm = {
        borrowerName: '',
        amount: null,
        purpose: '',
        purposeType: 'other',
        network: 'goerli',
        loanDuration: 7
      };
      
      this.totalAmount = 0;
      this.error = null;
    } catch (e: any) {
      this.error = e?.message || 'Error al enviar la solicitud de préstamo';
    }
  }
}