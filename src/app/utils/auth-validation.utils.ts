export class AuthValidationUtils {
  // Validar nombre de usuario
  static validateUsername(username: string): boolean {
    if (typeof username !== 'string') return false;
    const trimmed = username.trim();
    return trimmed.length >= 3 && trimmed.length <= 30 && /^[a-zA-Z0-9_]+$/.test(trimmed);
  }

  // Validar correo electrónico
  static validateEmail(email: string): boolean {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar contraseña
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (typeof password !== 'string') {
      errors.push('La contraseña debe ser una cadena de texto');
      return { isValid: false, errors };
    }
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (password.length > 128) {
      errors.push('La contraseña no puede exceder 128 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar confirmación de contraseña
  static validatePasswordConfirmation(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  // Validar token de autenticación
  static validateAuthToken(token: string): boolean {
    if (typeof token !== 'string') return false;
    // Verificar formato de token JWT
    const tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    return tokenRegex.test(token);
  }

  // Validar rol de usuario
  static validateUserRole(role: string): boolean {
    const validRoles = ['user', 'admin', 'moderator'];
    return validRoles.includes(role);
  }

  // Validar permisos de usuario
  static validateUserPermissions(permissions: string[]): boolean {
    if (!Array.isArray(permissions)) return false;
    
    const validPermissions = [
      'read_loans',
      'create_loan',
      'approve_loan',
      'reject_loan',
      'view_all_loans',
      'manage_users'
    ];
    
    return permissions.every(permission => validPermissions.includes(permission));
  }

  // Validar sesión de usuario
  static validateUserSession(session: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!session || typeof session !== 'object') {
      errors.push('La sesión no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar ID de usuario
    if (!session.userId || typeof session.userId !== 'string') {
      errors.push('El ID de usuario es requerido y debe ser una cadena');
    }
    
    // Validar token de autenticación
    if (!session.authToken || !this.validateAuthToken(session.authToken)) {
      errors.push('El token de autenticación no es válido');
    }
    
    // Validar fecha de expiración
    if (!session.expiresAt || !(session.expiresAt instanceof Date) || isNaN(session.expiresAt.getTime())) {
      errors.push('La fecha de expiración no es válida');
    }
    
    // Verificar si la sesión ha expirado
    if (session.expiresAt < new Date()) {
      errors.push('La sesión ha expirado');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar credenciales de inicio de sesión
  static validateLoginCredentials(credentials: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!credentials || typeof credentials !== 'object') {
      errors.push('Las credenciales no son un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar identificador (puede ser nombre de usuario o correo)
    if (!credentials.identifier || typeof credentials.identifier !== 'string') {
      errors.push('El identificador es requerido');
    } else {
      const identifier = credentials.identifier.trim();
      if (identifier.length === 0) {
        errors.push('El identificador no puede estar vacío');
      }
    }
    
    // Validar contraseña
    if (!credentials.password || typeof credentials.password !== 'string') {
      errors.push('La contraseña es requerida');
    } else {
      const passwordValidation = this.validatePassword(credentials.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}