import { Component } from '@angular/core';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent {
  title = 'Soporte y Contacto';
  
  contactInfo = {
    email: 'soporte@microtrust.com',
    phone: '+51 1 234 5678',
    address: 'Av. Principal 123, Lima, Perú',
    ruc: '20537570220'
  };
  
  faqs = [
    {
      question: '¿Cómo puedo solicitar un préstamo?',
      answer: 'Debes conectarte con tu wallet MetaMask, completar el formulario de solicitud y esperar la aprobación en 24 horas.'
    },
    {
      question: '¿Cuáles son los límites de préstamo?',
      answer: 'Los nuevos usuarios pueden solicitar hasta 20 tokens en Goerli y Holešky, y hasta 5 tokens en Sepolia y Ephemery.'
    },
    {
      question: '¿Cuánto tiempo tarda la aprobación?',
      answer: 'El proceso de aprobación toma hasta 24 horas hábiles después de enviar la solicitud.'
    },
    {
      question: '¿Qué tasas de interés aplican?',
      answer: 'Las tasas son: 5% para estudiantes, 10% para negocios y 18% para otros propósitos, cumpliendo con la ley peruana.'
    }
  ];
  
  supportChannels = [
    {
      name: 'Soporte por Email',
      description: 'Para consultas generales y soporte técnico',
      icon: '📧'
    },
    {
      name: 'Chat en Vivo',
      description: 'Asistencia inmediata durante horario comercial',
      icon: '💬'
    },
    {
      name: 'Comunidad en Discord',
      description: 'Conecta con otros usuarios y el equipo',
      icon: '🎮'
    },
    {
      name: 'Documentación',
      description: 'Guías y tutoriales detallados',
      icon: '📚'
    }
  ];
}