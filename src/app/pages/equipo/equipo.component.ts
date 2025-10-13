import { Component } from '@angular/core';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent {
  title = 'Nuestro Equipo';
  
  teamMembers = [
    {
      name: 'Víctor Cuaresma',
      role: 'Fundador & CEO',
      bio: 'Experto en blockchain y finanzas descentralizadas con más de 5 años de experiencia.',
      avatar: 'avatar1.png'
    },
    {
      name: 'María González',
      role: 'Desarrolladora Frontend',
      bio: 'Especialista en Angular y UX/UI con pasión por la inclusión financiera.',
      avatar: 'avatar2.png'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Desarrollador Blockchain',
      bio: 'Ingeniero de smart contracts y arquitecto de soluciones descentralizadas.',
      avatar: 'avatar3.png'
    },
    {
      name: 'Ana Martínez',
      role: 'Especialista en Cumplimiento',
      bio: 'Abogada con expertise en regulaciones fintech y compliance legal.',
      avatar: 'avatar4.png'
    }
  ];
  
  advisors = [
    {
      name: 'Dr. Roberto Silva',
      role: 'Asesor Financiero',
      bio: 'Profesor universitario y experto en microfinanzas con 15 años de experiencia.',
      avatar: 'advisor1.png'
    },
    {
      name: 'Laura Fernández',
      role: 'Asesora de Producto',
      bio: 'Especialista en diseño de productos digitales y experiencia del usuario.',
      avatar: 'advisor2.png'
    }
  ];
}