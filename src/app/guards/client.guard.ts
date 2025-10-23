import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import { APP_CONSTANTS } from '../constants/app.constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  
  constructor(
    private walletService: WalletService,
    private router: Router
  ) {}
  
  async canActivate(): Promise<boolean> {
    try {
      const accounts = await this.walletService.getAccounts();
      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        const isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.some(adminAddress => 
          adminAddress.toLowerCase() === account.toLowerCase()
        );
        
        // Si es admin, no permitir acceso a rutas de cliente
        if (isAdmin) {
          this.router.navigate(['/admin']);
          return false;
        } else {
          // Si no es admin, permitir acceso
          return true;
        }
      } else {
        // Si no hay cuenta conectada, permitir acceso a páginas públicas
        // Pero para rutas protegidas por ClientGuard, redirigir al login
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Error en ClientGuard:', error);
      // Mostrar error antes de redirigir
      Swal.fire({
        title: 'Error de autenticación',
        text: (error as Error).message || 'Error desconocido',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      // Para rutas de cliente, redirigir al login después de mostrar el error
      this.router.navigate(['/login']);
      return false;
    }
  }
}