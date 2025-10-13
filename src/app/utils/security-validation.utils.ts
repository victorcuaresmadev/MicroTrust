export class SecurityValidationUtils {
  // Validar entrada de texto para prevenir XSS
  static validateTextInput(input: string): boolean {
    if (!input) return true;
    
    // Verificar longitud máxima
    if (input.length > 1000) return false;
    
    // Verificar caracteres peligrosos
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(input));
  }

  // Validar dirección de correo electrónico
  static validateEmail(email: string): boolean {
    if (!email) return false;
    
    // Expresión regular para validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar número de teléfono
  static validatePhone(phone: string): boolean {
    if (!phone) return false;
    
    // Expresión regular para validar número de teléfono (formato internacional)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  // Validar contraseña
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('La contraseña es requerida');
      return { isValid: false, errors };
    }
    
    // Verificar longitud mínima
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    // Verificar que contenga letras mayúsculas
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    // Verificar que contenga letras minúsculas
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    // Verificar que contenga números
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    
    // Verificar que contenga caracteres especiales
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar token de autenticación
  static validateAuthToken(token: string): boolean {
    if (!token) return false;
    
    // Verificar que tenga el formato de token JWT
    const tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    return tokenRegex.test(token);
  }

  // Validar IP address
  static validateIpAddress(ip: string): boolean {
    if (!ip) return false;
    
    // Expresión regular para validar dirección IP v4
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ipRegex.exec(ip);
    
    if (!match) return false;
    
    // Verificar que cada octeto esté en el rango 0-255
    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(match[i], 10);
      if (octet < 0 || octet > 255) return false;
    }
    
    return true;
  }
}