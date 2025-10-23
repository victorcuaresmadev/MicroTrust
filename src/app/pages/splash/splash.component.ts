import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
  countdown: number = 30;

  constructor(private router: Router) {}

  ngOnInit() {
    // No se necesita temporizador
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}