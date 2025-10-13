import { Component } from '@angular/core';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.css']
})
export class ObjetivosComponent {
  title = 'Objetivos de MicroTrust';
  
  mainObjectives = [
    {
      title: 'Inclusión Financiera',
      description: 'Brindar acceso a servicios financieros a personas no bancarizadas o sub-bancarizadas.'
    },
    {
      title: 'Transparencia',
      description: 'Garantizar la total transparencia en todos los procesos de préstamo mediante blockchain.'
    },
    {
      title: 'Accesibilidad',
      description: 'Ofrecer préstamos con requisitos mínimos y procesos simplificados.'
    },
    {
      title: 'Educación Financiera',
      description: 'Promover la educación financiera y el uso responsable del crédito.'
    }
  ];
  
  longTermGoals = [
    'Expandir a más redes blockchain y criptomonedas',
    'Implementar sistema de calificación crediticia descentralizado',
    'Integrar más opciones de pago y reembolso',
    'Crear una comunidad de usuarios que apoyen a nuevos prestatarios',
    'Desarrollar productos financieros adicionales'
  ];
}