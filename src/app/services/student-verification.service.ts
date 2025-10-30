import { Injectable } from '@angular/core';

export interface StudentVerificationData {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
  careerProgram: string;
  enrollmentYear: string;
  verifiedAt: string;
  status: 'verified' | 'pending' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class StudentVerificationService {
  private readonly STORAGE_KEY = 'student_verification';

  constructor() { }

  // Verificar si el usuario está verificado como estudiante
  isVerified(): boolean {
    const verification = this.getVerification();
    return verification !== null && verification.status === 'verified';
  }

  // Obtener los datos de verificación
  getVerification(): StudentVerificationData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as StudentVerificationData;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener verificación de estudiante:', error);
      return null;
    }
  }

  // Guardar verificación de estudiante
  saveVerification(data: StudentVerificationData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar verificación de estudiante:', error);
    }
  }

  // Eliminar verificación
  clearVerification(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error al eliminar verificación de estudiante:', error);
    }
  }

  // Validar formato de correo institucional
  validateInstitutionalEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@MicroTrust\.edu\.pe$/i;
    return emailRegex.test(email);
  }

  // Validar formato de DNI peruano (8 dígitos)
  validateDni(dni: string): boolean {
    const dniRegex = /^[0-9]{8}$/;
    return dniRegex.test(dni);
  }

  // Obtener DNI del estudiante verificado
  getDni(): string | null {
    const verification = this.getVerification();
    return verification ? verification.dni : null;
  }

  // Obtener nombre completo del estudiante verificado
  getFullName(): string | null {
    const verification = this.getVerification();
    if (verification) {
      return `${verification.firstName} ${verification.lastName}`;
    }
    return null;
  }

  // Obtener correo del estudiante verificado
  getEmail(): string | null {
    const verification = this.getVerification();
    return verification ? verification.email : null;
  }

  // Verificar si la verificación está expirada (opcional - para futuras mejoras)
  isVerificationExpired(): boolean {
    const verification = this.getVerification();
    if (!verification || !verification.verifiedAt) {
      return true;
    }

    // Verificación válida por 1 año
    const verifiedDate = new Date(verification.verifiedAt);
    const expirationDate = new Date(verifiedDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    return new Date() > expirationDate;
  }
}

