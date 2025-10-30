import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface StudentVerification {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
  careerProgram: string;
  enrollmentYear: string;
}

interface DniApiResponse {
  success: boolean;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  codVerifica: number;
  codVerificaLetra: string;
}

interface DniApiResponseBackup {
  first_name: string;
  first_last_name: string;
  second_last_name: string;
  full_name: string;
  document_number: string;
}

@Component({
  selector: 'app-student-verification',
  templateUrl: './student-verification.component.html',
  styleUrls: ['./student-verification.component.css']
})
export class StudentVerificationComponent implements OnInit {
  isLoading: boolean = false;
  isLoadingDni: boolean = false;
  dniVerified: boolean = false;
  error: string | null = null;
  emailUsername: string = '';
  
  private readonly DNI_API_URL = 'https://dniruc.apisperu.com/api/v1/dni/';
  private readonly DNI_API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImZvcm11bGExdHZ1eEBnbWFpbC5jb20ifQ.zPA8U_14cLDWrmceOCnALK_LyEce2Lol0v3mReEm2T0';
  
  // API de respaldo (fallback)
  private readonly DNI_API_BACKUP_URL = 'https://api.decolecta.com/v1/reniec/dni?numero=';
  private readonly DNI_API_BACKUP_TOKEN = 'Bearer sk_11296.xexQtIYGeFroPb5w24ocTACfTzAlexnD';
  
  private readonly EMAIL_DOMAIN = '@MicroTrust.edu.pe';

  verificationForm: StudentVerification = {
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    universityName: '',
    careerProgram: '',
    enrollmentYear: ''
  };

  currentYear = new Date().getFullYear();
  enrollmentYears: number[] = [];
  private dniTimeout: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Generar años de matrícula (últimos 10 años)
    for (let i = 0; i < 10; i++) {
      this.enrollmentYears.push(this.currentYear - i);
    }
  }

  updateEmail() {
    // Concatenar username con el dominio
    if (this.emailUsername.trim()) {
      this.verificationForm.email = this.emailUsername.trim() + this.EMAIL_DOMAIN;
    } else {
      this.verificationForm.email = '';
    }
  }

  onDniChange() {
    // Limpiar timeout anterior
    if (this.dniTimeout) {
      clearTimeout(this.dniTimeout);
    }

    const dni = this.verificationForm.dni.trim();
    
    // Validar que solo contenga números
    this.verificationForm.dni = dni.replace(/[^0-9]/g, '');
    
    // Si el DNI tiene 8 dígitos, consultar la API
    if (this.verificationForm.dni.length === 8) {
      // Esperar 500ms antes de hacer la consulta (debounce)
      this.dniTimeout = setTimeout(() => {
        this.consultarDni(this.verificationForm.dni);
      }, 500);
    } else {
      // Limpiar datos si el DNI es inválido
      this.dniVerified = false;
      if (!this.dniVerified) {
        this.verificationForm.firstName = '';
        this.verificationForm.lastName = '';
      }
    }
  }

  async consultarDni(dni: string) {
    this.isLoadingDni = true;
    this.error = null;

    try {
      // Intentar con la API principal primero
      const url = `${this.DNI_API_URL}${dni}?token=${this.DNI_API_TOKEN}`;
      const response = await this.http.get<DniApiResponse>(url).toPromise();

      if (response && response.success && response.dni) {
        // Autocompletar campos
        this.verificationForm.firstName = response.nombres;
        this.verificationForm.lastName = `${response.apellidoPaterno} ${response.apellidoMaterno}`;
        this.dniVerified = true;

        // Mostrar mensaje de éxito
        await Swal.fire({
          title: '✅ DNI Verificado',
          html: `
            <div style="text-align: left; padding: 10px;">
              <p><strong>Nombres:</strong> ${response.nombres}</p>
              <p><strong>Apellidos:</strong> ${response.apellidoPaterno} ${response.apellidoMaterno}</p>
            </div>
          `,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        this.isLoadingDni = false;
        return;
      }
    } catch (error: any) {
      console.warn('API principal falló, intentando con API de respaldo...', error);
      
      // Si la API principal falla, intentar con la API de respaldo
      try {
        const backupUrl = `${this.DNI_API_BACKUP_URL}${dni}`;
        const headers = { 'Authorization': this.DNI_API_BACKUP_TOKEN };
        
        const backupResponse = await this.http.get<DniApiResponseBackup>(
          backupUrl, 
          { headers }
        ).toPromise();

        if (backupResponse && backupResponse.document_number) {
          // Autocompletar campos con la estructura de la API de respaldo
          this.verificationForm.firstName = backupResponse.first_name;
          this.verificationForm.lastName = `${backupResponse.first_last_name} ${backupResponse.second_last_name}`;
          this.dniVerified = true;

          // Mostrar mensaje de éxito
          await Swal.fire({
            title: '✅ DNI Verificado (Respaldo)',
            html: `
              <div style="text-align: left; padding: 10px;">
                <p><strong>Nombres:</strong> ${backupResponse.first_name}</p>
                <p><strong>Apellidos:</strong> ${backupResponse.first_last_name} ${backupResponse.second_last_name}</p>
              </div>
            `,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          this.isLoadingDni = false;
          return;
        }
      } catch (backupError: any) {
        console.error('Error en API de respaldo:', backupError);
      }
    }

    // Si ambas APIs fallan
    this.dniVerified = false;
    this.error = 'No se pudo verificar el DNI. Intenta nuevamente.';
    this.isLoadingDni = false;
  }

  async submitVerification() {
    this.error = null;

    // Validaciones
    if (!this.verificationForm.dni.trim()) {
      this.error = 'El DNI es obligatorio';
      return;
    }

    if (this.verificationForm.dni.length !== 8) {
      this.error = 'El DNI debe tener 8 dígitos';
      return;
    }

    if (!this.dniVerified) {
      this.error = 'Debes verificar tu DNI antes de continuar';
      return;
    }

    if (!this.verificationForm.firstName.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    if (!this.verificationForm.lastName.trim()) {
      this.error = 'El apellido es obligatorio';
      return;
    }

    if (!this.emailUsername.trim()) {
      this.error = 'El correo electrónico es obligatorio';
      return;
    }

    // Validar formato de username (solo alfanuméricos, puntos, guiones y guiones bajos)
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(this.emailUsername.trim())) {
      this.error = 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos';
      return;
    }

    // Actualizar email completo
    this.updateEmail();

    if (!this.verificationForm.universityName.trim()) {
      this.error = 'El nombre de la universidad es obligatorio';
      return;
    }

    if (!this.verificationForm.careerProgram.trim()) {
      this.error = 'La carrera/programa es obligatoria';
      return;
    }

    if (!this.verificationForm.enrollmentYear) {
      this.error = 'El año de matrícula es obligatorio';
      return;
    }

    // Simular proceso de verificación
    this.isLoading = true;

    setTimeout(async () => {
      this.isLoading = false;

      // Guardar verificación en localStorage
      const verification = {
        ...this.verificationForm,
        verifiedAt: new Date().toISOString(),
        status: 'verified'
      };

      localStorage.setItem('student_verification', JSON.stringify(verification));

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: '✅ Verificación Exitosa',
        html: `
          <div style="text-align: left; padding: 20px;">
            <p style="font-size: 16px; margin-bottom: 15px;">
              <strong>¡Felicidades, ${this.verificationForm.firstName}!</strong>
            </p>
            <p style="margin-bottom: 15px;">
              Tu identidad como estudiante ha sido verificada correctamente.
            </p>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0284c7;">
              <p style="margin: 5px 0;"><strong>🆔 DNI:</strong> ${this.verificationForm.dni}</p>
              <p style="margin: 5px 0;"><strong>📧 Correo:</strong> ${this.verificationForm.email}</p>
              <p style="margin: 5px 0;"><strong>🎓 Universidad:</strong> ${this.verificationForm.universityName}</p>
              <p style="margin: 5px 0;"><strong>📚 Carrera:</strong> ${this.verificationForm.careerProgram}</p>
            </div>
            <p style="margin-top: 15px; color: #059669;">
              ✓ Ahora puedes acceder a la tasa de interés preferencial para estudiantes (12%)
            </p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: '👍 Continuar',
        confirmButtonColor: '#059669',
        allowOutsideClick: false
      });

      // Cerrar la ventana y volver al formulario
      window.close();

      // Si no se puede cerrar la ventana, redirigir
      setTimeout(() => {
        this.router.navigate(['/client/solicitar-prestamo']);
      }, 500);

    }, 2000); // Simular tiempo de verificación
  }

  cancelVerification() {
    window.close();
  }
}

