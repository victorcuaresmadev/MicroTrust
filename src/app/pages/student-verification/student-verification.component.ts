import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface StudentVerification {
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
  studentId: string;
  careerProgram: string;
  enrollmentYear: string;
}

@Component({
  selector: 'app-student-verification',
  templateUrl: './student-verification.component.html',
  styleUrls: ['./student-verification.component.css']
})
export class StudentVerificationComponent implements OnInit {
  isLoading: boolean = false;
  error: string | null = null;

  verificationForm: StudentVerification = {
    firstName: '',
    lastName: '',
    email: '',
    universityName: '',
    studentId: '',
    careerProgram: '',
    enrollmentYear: ''
  };

  currentYear = new Date().getFullYear();
  enrollmentYears: number[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // Generar años de matrícula (últimos 10 años)
    for (let i = 0; i < 10; i++) {
      this.enrollmentYears.push(this.currentYear - i);
    }
  }

  async submitVerification() {
    this.error = null;

    // Validaciones
    if (!this.verificationForm.firstName.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    if (!this.verificationForm.lastName.trim()) {
      this.error = 'El apellido es obligatorio';
      return;
    }

    if (!this.verificationForm.email.trim()) {
      this.error = 'El correo electrónico es obligatorio';
      return;
    }

    // Validar formato de correo @MicroTrust.edu.pe
    const emailRegex = /^[a-zA-Z0-9._-]+@MicroTrust\.edu\.pe$/i;
    if (!emailRegex.test(this.verificationForm.email)) {
      this.error = 'El correo debe ser institucional (@MicroTrust.edu.pe)';
      return;
    }

    if (!this.verificationForm.universityName.trim()) {
      this.error = 'El nombre de la universidad es obligatorio';
      return;
    }

    if (!this.verificationForm.studentId.trim()) {
      this.error = 'El código de estudiante es obligatorio';
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
              <p style="margin: 5px 0;"><strong>📧 Correo:</strong> ${this.verificationForm.email}</p>
              <p style="margin: 5px 0;"><strong>🎓 Universidad:</strong> ${this.verificationForm.universityName}</p>
              <p style="margin: 5px 0;"><strong>📚 Carrera:</strong> ${this.verificationForm.careerProgram}</p>
              <p style="margin: 5px 0;"><strong>🆔 Código:</strong> ${this.verificationForm.studentId}</p>
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

