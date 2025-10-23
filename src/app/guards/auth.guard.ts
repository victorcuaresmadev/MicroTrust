import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private walletService: WalletService,
    private router: Router
  ) {}
  
  async canActivate(): Promise<boolean> {
    try {
      const accounts = await this.walletService.getAccounts();
      if (accounts && accounts.length > 0) {
        // Usuario autenticado
        return true;
      } else {
        // Usuario no autenticado, redirigir a login
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Error en AuthGuard:', error);
      // En lugar de redirigir inmediatamente, mostrar el error
      // El usuario podrá ver el error antes de cualquier redirección
      Swal.fire({
        title: 'Error de autenticación',
        text: (error as Error).message || 'Error desconocido',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigate(['/login']);
      return false;
    }
  }
}