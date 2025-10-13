import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  constructor() { }

  // Agregar notificación
  addNotification(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      timestamp: new Date()
    };
    
    this.notifications.push(notification);
    this.notificationsSubject.next([...this.notifications]);
    
    // Eliminar notificación después de 5 segundos
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  // Obtener todas las notificaciones como Observable
  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  // Eliminar notificación específica
  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
  }

  // Eliminar todas las notificaciones
  clearAll(): void {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }

  // Generar ID único
  private generateId(): string {
    return 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}