export class ErrorUtils {
  // Formatear mensaje de error
  static formatErrorMessage(error: any): string {
    if (!error) return 'Ocurrió un error desconocido';
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    
    return 'Ocurrió un error desconocido';
  }

  // Registrar error
  static logError(error: any, context: string = ''): void {
    console.error(`[${context}] Error:`, error);
  }

  // Crear error personalizado
  static createError(message: string, code?: string): Error {
    const error = new Error(message);
    if (code) {
      (error as any).code = code;
    }
    return error;
  }

  // Verificar si es un error de red
  static isNetworkError(error: any): boolean {
    return error && (
      error.name === 'NetworkError' ||
      error.message?.includes('network') ||
      error.message?.includes('fetch') ||
      error.code === 'NETWORK_ERROR'
    );
  }

  // Verificar si es un error de autenticación
  static isAuthError(error: any): boolean {
    return error && (
      error.code === 'UNAUTHORIZED' ||
      error.message?.includes('authentication') ||
      error.message?.includes('auth') ||
      error.status === 401 ||
      error.status === 403
    );
  }
}