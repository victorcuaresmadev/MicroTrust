import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { LoanService } from '../../services/loan/loan.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { PurposeTypeConfig, NetworkConfig } from '../../interfaces/loan.interface';
import { HttpClient } from '@angular/common/http';
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
  
  // Verificación de negocio
  isBusinessVerified: boolean = false;
  businessRUC: string = '';
  businessName: string = '';
  wantsBusinessVerification: boolean = false;
  isVerifyingBusiness: boolean = false;
  
  // Formulario de solicitud
  loanForm = {
    borrowerName: '',
    amount: null as number | null,
    purpose: '',
    purposeType: 'other' as 'student' | 'business' | 'health' | 'events' | 'other',
    network: 'goerli' as 'goerli' | 'holesky' | 'sepolia' | 'hoodi' | 'ephemery',
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
    APP_CONSTANTS.NETWORKS.HOODI,
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
    private loanService: LoanService,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    this.updateInterestRate();
    this.updateLoanLimit(); // Establecer límite inicial según la red por defecto
    this.calculateFinalInterestRate(); // Calcular tasa final con descuentos
    this.checkStudentVerification();
    this.checkBusinessVerification();
    
    // Escuchar cambios en la verificación de estudiante (cuando se cierra la ventana)
    window.addEventListener('storage', (e) => {
      if (e.key === 'student_verification') {
        this.checkStudentVerification();
      }
      if (e.key === 'business_verification') {
        this.checkBusinessVerification();
      }
    });
  }
  
  checkBusinessVerification() {
    const verification = localStorage.getItem('business_verification');
    if (verification) {
      try {
        const data = JSON.parse(verification);
        if (data.status === 'verified') {
          this.isBusinessVerified = true;
          this.businessRUC = data.ruc;
          this.businessName = data.razonSocial;
          this.calculateFinalInterestRate();
        }
      } catch (error) {
        this.isBusinessVerified = false;
      }
    }
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
    let finalRate = this.interestRate;
    let discountByDuration = 0;
    
    if (this.loanForm.loanDuration === 7) {
      // 7 días: 2.5% de descuento
      discountByDuration = 2.5;
      finalRate = this.interestRate * (1 - 0.025);
    } else if (this.loanForm.loanDuration === 15) {
      // 15 días: 3% de descuento
      discountByDuration = 3;
      finalRate = this.interestRate * (1 - 0.03);
    }
    
    // Aplicar descuento por verificación de negocio (solo para business)
    if (this.loanForm.purposeType === 'business' && this.isBusinessVerified) {
      // Descuento del 2% adicional (de 17% a 15%)
      finalRate = finalRate - 0.02; // Restar 2% directamente
      this.hasDiscount = true;
      this.discountPercentage = discountByDuration + 2; // Sumar descuentos
    } else {
      this.hasDiscount = discountByDuration > 0;
      this.discountPercentage = discountByDuration;
    }
    
    // Asegurar que no sea negativo
    if (finalRate < 0) finalRate = 0;
    
    this.finalInterestRate = finalRate;
  }
  
  onAmountChange() {
    this.calculateTotalAmount();
  }
  
  onDurationChange() {
    this.calculateTotalAmount();
  }
  
  onNetworkChange() {
    this.updateLoanLimit();
    
    // Advertencia para Goerli y Ephemery - No disponibles temporalmente
    if (this.loanForm.network === 'goerli' || this.loanForm.network === 'ephemery') {
      const networkName = this.loanForm.network === 'goerli' ? 'Goerli' : 'Ephemery';
      Swal.fire({
        title: '🚫 Red No Disponible',
        html: `
          <div style="text-align: left; padding: 20px; background: rgba(239, 68, 68, 0.1); border-radius: 10px; border: 2px solid #ef4444;">
            <p style="font-size: 18px; margin-bottom: 15px; color: #ef4444; font-weight: 700;">
              🚨 La red ${networkName} no está disponible temporalmente
            </p>
            <p style="font-size: 15px; margin-bottom: 15px; line-height: 1.6; color: #333;">
              💰 <strong>Estamos trabajando en tener saldo en esta red</strong>
            </p>
            <p style="font-size: 14px; margin-bottom: 15px; line-height: 1.6;">
              Por el momento <strong>NO SE PUEDE SOLICITAR PRÉSTAMOS</strong> en la red ${networkName}.
            </p>
            <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 14px; margin-bottom: 10px; color: #059669; font-weight: 600;">
                ✅ Redes disponibles actualmente:
              </p>
              <ul style="font-size: 14px; margin-left: 20px; line-height: 1.8; color: #065f46;">
                <li>🟢 <strong>Hoodi</strong> - Límite: 8 ETH (Rápida y estable)</li>
                <li>🟢 <strong>Sepolia</strong> - Límite: 5 ETH (Rápida y estable)</li>
                <li>🟡 <strong>Holesky</strong> - Límite: 10 ETH (Lenta: 5-10 min)</li>
              </ul>
            </div>
            <p style="font-size: 13px; margin-top: 15px; color: #888; font-style: italic;">
              📧 Te notificaremos cuando ${networkName} esté disponible nuevamente.
            </p>
          </div>
        `,
        icon: 'error',
        confirmButtonText: '✅ Cambiar a Hoodi',
        confirmButtonColor: '#667eea',
        showCancelButton: true,
        cancelButtonText: 'Elegir otra red',
        cancelButtonColor: '#6b7280',
        width: '650px',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Cambiar a Hoodi
          this.loanForm.network = 'hoodi';
          this.updateLoanLimit();
        } else {
          // Cambiar a Sepolia como segunda opción
          this.loanForm.network = 'sepolia';
          this.updateLoanLimit();
        }
      });
      return;
    }
    
    // Advertencia para Holesky - Red que será descontinuada
    if (this.loanForm.network === 'holesky') {
      Swal.fire({
        title: '⚠️ Advertencia de Red Holesky',
        html: `
          <div style="text-align: left; padding: 20px; background: rgba(239, 68, 68, 0.1); border-radius: 10px; border: 2px solid #ef4444;">
            <p style="font-size: 16px; margin-bottom: 15px; color: #ef4444; font-weight: 600;">
              🚨 La red Holesky será descontinuada el 31 de octubre de 2025
            </p>
            <p style="font-size: 14px; margin-bottom: 10px; line-height: 1.6;">
              ⏱️ <strong>Las transacciones en Holesky están tardando entre 5-10 minutos</strong> debido a la sobrecarga de la red.
            </p>
            <p style="font-size: 14px; margin-bottom: 15px; line-height: 1.6;">
              ✅ <strong>Recomendamos usar:</strong>
            </p>
            <ul style="font-size: 14px; margin-left: 20px; line-height: 1.8;">
              <li>🟢 <strong>Hoodi</strong> - Red estable y rápida</li>
              <li>🟢 <strong>Sepolia</strong> - Red estable y rápida</li>
            </ul>
            <p style="font-size: 13px; margin-top: 15px; color: #888; font-style: italic;">
              Si decides continuar con Holesky, ten paciencia con los tiempos de confirmación.
            </p>
          </div>
        `,
        icon: 'warning',
        confirmButtonText: 'Continuar con Holesky',
        confirmButtonColor: '#ef4444',
        showCancelButton: true,
        cancelButtonText: '✅ Cambiar a Hoodi',
        cancelButtonColor: '#667eea',
        width: '600px'
      }).then((result) => {
        if (!result.isConfirmed) {
          // Si cancela, cambiar a Hoodi por defecto
          this.loanForm.network = 'hoodi';
          this.updateLoanLimit();
        }
      });
    }
  }
  
  onPurposeTypeChange() {
    this.updateInterestRate();
    
    // Resetear verificación de negocio si cambia de propósito
    if (this.loanForm.purposeType !== 'business') {
      this.isBusinessVerified = false;
      this.businessRUC = '';
      this.businessName = '';
      this.wantsBusinessVerification = false;
      this.calculateFinalInterestRate();
    }
    
    // Si selecciona negocio, ofrecer verificación
    if (this.loanForm.purposeType === 'business' && !this.isBusinessVerified) {
      this.offerBusinessVerification();
      return;
    }
    
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
                <li>DNI peruano de 8 dígitos (actúa como código de estudiante)</li>
                <li>Correo institucional (.edu.pe)</li>
                <li>Nombre de tu universidad</li>
                <li>Información de carrera y año de matrícula</li>
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
  
  // Ofrecer verificación de negocio
  offerBusinessVerification() {
    Swal.fire({
      title: '💼 Verificar Negocio - Descuento del 2%',
      html: `
        <div style="text-align: left; padding: 15px;">
          <p style="margin-bottom: 15px; font-size: 16px;">
            ⚡ <strong>Oferta Especial:</strong> Si verificas tu negocio con RUC, obtienes un <strong>descuento del 2% en el interés</strong>.
          </p>
          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0; border: 2px solid #10b981;">
            <p style="margin: 5px 0; font-size: 15px;"><strong>💰 Ahorro Financiero:</strong></p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
              <div style="background: #fee2e2; padding: 10px; border-radius: 6px;">
                <div style="font-size: 12px; color: #991b1b;">Sin verificación:</div>
                <div style="font-size: 18px; font-weight: 700; color: #dc2626;">17% interés</div>
              </div>
              <div style="background: #d1fae5; padding: 10px; border-radius: 6px;">
                <div style="font-size: 12px; color: #065f46;">Con verificación:</div>
                <div style="font-size: 18px; font-weight: 700; color: #059669;">15% interés ✅</div>
              </div>
            </div>
            <p style="margin-top: 10px; font-size: 13px; color: #065f46;">
              ✅ Solo necesitas tu <strong>RUC de 11 dígitos</strong>
            </p>
          </div>
          <p style="color: #666; margin-top: 15px; font-size: 14px;">
            Si no quieres verificar, puedes continuar con el 17% de interés.
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '✅ Sí, Verificar Negocio',
      cancelButtonText: '❌ No, Continuar con 17%',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      width: '700px'
    }).then((result) => {
      if (result.isConfirmed) {
        this.wantsBusinessVerification = true;
        this.promptRUC();
      } else {
        this.wantsBusinessVerification = false;
        this.isBusinessVerified = false;
        this.calculateFinalInterestRate();
      }
    });
  }
  
  // Solicitar RUC al usuario
  promptRUC() {
    Swal.fire({
      title: '💼 Verificar RUC del Negocio',
      html: `
        <div style="text-align: left; padding: 15px;">
          <p style="margin-bottom: 15px;">
            Ingresa el <strong>RUC de 11 dígitos</strong> de tu negocio para obtener el descuento del 2%.
          </p>
          <input 
            id="rucInput" 
            class="swal2-input" 
            type="text" 
            placeholder="Ejemplo: 20131312955"
            maxlength="11"
            pattern="[0-9]{11}">
          <div style="background: #f0f9ff; padding: 12px; border-radius: 6px; margin-top: 10px; font-size: 12px;">
            <strong>ℹ️ Información:</strong> Solo validaremos el RUC y la razón social. 
            Tus datos están seguros y protegidos.
          </div>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '✅ Verificar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un RUC';
        }
        if (!/^[0-9]{11}$/.test(value)) {
          return 'El RUC debe tener exactamente 11 dígitos numéricos';
        }
        return null;
      },
      preConfirm: () => {
        const rucInput = document.getElementById('rucInput') as HTMLInputElement;
        return rucInput?.value || '';
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.businessRUC = result.value;
        this.verifyBusinessRUC(this.businessRUC);
      }
    });
  }
  
  // Verificar RUC con la API
  async verifyBusinessRUC(ruc: string) {
    this.isVerifyingBusiness = true;
    
    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImZvcm11bGExdHZ1eEBnbWFpbC5jb20ifQ.zPA8U_14cLDWrmceOCnALK_LyEce2Lol0v3mReEm2T0';
      const url = `https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${token}`;
      
      const response = await this.http.get<any>(url).toPromise();
      
      if (response && response.ruc && response.razonSocial) {
        this.businessName = response.razonSocial;
        this.isBusinessVerified = true;
        this.calculateFinalInterestRate();
        
        // Guardar verificación en localStorage
        const businessVerification = {
          ruc: this.businessRUC,
          razonSocial: this.businessName,
          status: 'verified',
          verifiedAt: new Date().toISOString()
        };
        localStorage.setItem('business_verification', JSON.stringify(businessVerification));
        
        await Swal.fire({
          title: '✅ Negocio Verificado Exitosamente',
          html: `
            <div style="text-align: left; padding: 15px;">
              <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0; border: 2px solid #10b981;">
                <p style="margin: 5px 0;"><strong>RUC:</strong> ${this.businessRUC}</p>
                <p style="margin: 5px 0;"><strong>Razón Social:</strong> ${this.businessName}</p>
              </div>
              <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="color: #1e40af; font-weight: 600; margin-bottom: 8px;">
                  🎉 Descuento Aplicado:
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                    <div style="font-size: 12px; color: #666;">Interés sin verificación:</div>
                    <div style="font-size: 18px; font-weight: 700; color: #dc2626;">17%</div>
                  </div>
                  <div>
                    <div style="font-size: 12px; color: #666;">Interés con verificación:</div>
                    <div style="font-size: 18px; font-weight: 700; color: #059669;">15% ✅</div>
                  </div>
                </div>
                <p style="margin-top: 10px; font-size: 13px; color: #065f46;">
                  Has ahorrado <strong>2% de interés</strong> al verificar tu negocio.
                </p>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonText: '👍 Perfecto',
          confirmButtonColor: '#10b981',
          width: '650px'
        });
      } else {
        throw new Error('Respuesta inválida de la API');
      }
    } catch (error: any) {
      console.error('Error al verificar RUC:', error);
      
      await Swal.fire({
        title: '❌ Error al Verificar RUC',
        html: `
          <div style="text-align: left; padding: 15px;">
            <p style="margin-bottom: 15px;">
              No se pudo verificar el RUC <strong>${ruc}</strong>.
            </p>
            <div style="background: #fee2e2; padding: 12px; border-radius: 6px; font-size: 12px;">
              <strong>Posibles causas:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>El RUC no existe en SUNAT</li>
                <li>Error de conexión con la API</li>
                <li>El RUC está inactivo</li>
              </ul>
            </div>
            <p style="margin-top: 15px; font-size: 14px;">
              Puedes continuar sin verificación con el 17% de interés.
            </p>
          </div>
        `,
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Reintentar',
        cancelButtonText: 'Continuar sin verificación',
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#6b7280'
      }).then((retryResult) => {
        if (retryResult.isConfirmed) {
          this.promptRUC();
        } else {
          this.isBusinessVerified = false;
          this.businessRUC = '';
          this.businessName = '';
          this.calculateFinalInterestRate();
        }
      });
    } finally {
      this.isVerifyingBusiness = false;
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
    if (net.value === 'goerli' || net.value === 'holesky' || net.value === 'sepolia' || net.value === 'hoodi' || net.value === 'ephemery') {
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