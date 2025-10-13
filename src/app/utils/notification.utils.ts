export class NotificationUtils {
  // Crear notificación de éxito
  static createSuccessNotification(message: string): any {
    return {
      type: 'success',
      message
    };
  }

  // Crear notificación de error
  static createErrorNotification(message: string): any {
    return {
      type: 'error',
      message
    };
  }

  // Crear notificación de advertencia
  static createWarningNotification(message: string): any {
    return {
      type: 'warning',
      message
    };
  }

  // Crear notificación de información
  static createInfoNotification(message: string): any {
    return {
      type: 'info',
      message
    };
  }
}