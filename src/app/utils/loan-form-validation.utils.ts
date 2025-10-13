export class LoanFormValidationUtils {
  // Validar nombre del solicitante
  static validateBorrowerName(name: string): { isValid: boolean; error?: string } {
    if (!name) {
      return { isValid: false, error: 'El nombre es requerido' };
    }
    
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      return { isValid: false, error: 'El nombre debe tener al menos 3 caracteres' };
    }
    
    if (trimmed.length > 100) {
      return { isValid: false, error: 'El nombre no puede exceder 100 caracteres' };
    }
    
    return { isValid: true };
  }

  // Validar monto del préstamo
  static validateLoanAmount(amount: number, limit: number): { isValid: boolean; error?: string } {
    if (amount === null || amount === undefined) {
      return { isValid: false, error: 'El monto es requerido' };
    }
    
    if (amount <= 0) {
      return { isValid: false, error: 'El monto debe ser mayor a 0' };
    }
    
    if (amount > limit) {
      return { isValid: false, error: `El monto no puede exceder el límite de ${limit}` };
    }
    
    return { isValid: true };
  }

  // Validar propósito del préstamo
  static validateLoanPurpose(purpose: string): { isValid: boolean; error?: string } {
    if (!purpose) {
      return { isValid: false, error: 'El propósito es requerido' };
    }
    
    const trimmed = purpose.trim();
    if (trimmed.length < 10) {
      return { isValid: false, error: 'El propósito debe tener al menos 10 caracteres' };
    }
    
    if (trimmed.length > 500) {
      return { isValid: false, error: 'El propósito no puede exceder 500 caracteres' };
    }
    
    return { isValid: true };
  }

  // Validar tipo de propósito
  static validatePurposeType(type: string): { isValid: boolean; error?: string } {
    const validTypes = ['student', 'business', 'other'];
    if (!validTypes.includes(type)) {
      return { isValid: false, error: 'El tipo de propósito no es válido' };
    }
    return { isValid: true };
  }

  // Validar red blockchain
  static validateNetwork(network: string): { isValid: boolean; error?: string } {
    const validNetworks = ['goerli', 'holesky', 'sepolia', 'ephemery'];
    if (!validNetworks.includes(network)) {
      return { isValid: false, error: 'La red seleccionada no es válida' };
    }
    return { isValid: true };
  }

  // Validar formulario completo
  static validateLoanForm(
    formData: any,
    networkLimit: number
  ): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Validar nombre
    const nameValidation = this.validateBorrowerName(formData.borrowerName);
    if (!nameValidation.isValid && nameValidation.error) {
      errors['borrowerName'] = nameValidation.error;
    }

    // Validar monto
    const amountValidation = this.validateLoanAmount(formData.amount, networkLimit);
    if (!amountValidation.isValid && amountValidation.error) {
      errors['amount'] = amountValidation.error;
    }

    // Validar propósito
    const purposeValidation = this.validateLoanPurpose(formData.purpose);
    if (!purposeValidation.isValid && purposeValidation.error) {
      errors['purpose'] = purposeValidation.error;
    }

    // Validar tipo de propósito
    const purposeTypeValidation = this.validatePurposeType(formData.purposeType);
    if (!purposeTypeValidation.isValid && purposeTypeValidation.error) {
      errors['purposeType'] = purposeTypeValidation.error;
    }

    // Validar red
    const networkValidation = this.validateNetwork(formData.network);
    if (!networkValidation.isValid && networkValidation.error) {
      errors['network'] = networkValidation.error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}