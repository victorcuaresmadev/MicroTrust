import { Notification } from '../interfaces/notification.interface';

export class NotificationValidationUtils {
  // Validar notificación
  static validateNotification(notification: Notification): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar ID
    if (!notification.id) {
      errors.push('El ID de la notificación es requerido');
    }

    // Validar tipo
    if (!['success', 'error', 'warning', 'info'].includes(notification.type)) {
      errors.push('El tipo de notificación no es válido');
    }

    // Validar mensaje
    if (!notification.message) {
      errors.push('El mensaje de la notificación es requerido');
    }

    // Validar timestamp
    if (!(notification.timestamp instanceof Date) || isNaN(notification.timestamp.getTime())) {
      errors.push('La fecha de la notificación no es válida');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar tipo de notificación
  static validateNotificationType(type: string): boolean {
    return ['success', 'error', 'warning', 'info'].includes(type);
  }

  // Validar mensaje de notificación
  static validateNotificationMessage(message: string): boolean {
    return typeof message === 'string' && message.trim().length > 0;
  }

  // Validar ID de notificación
  static validateNotificationId(id: string): boolean {
    return typeof id === 'string' && id.trim().length > 0;
  }
}