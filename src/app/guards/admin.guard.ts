import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
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
        
        if (isAdmin) {
          return true;
        } else {
          // Si no es admin, redirigir a la página principal
          this.router.navigate(['/']);
          return false;
        }
      } else {
        // Si no hay cuenta conectada, redirigir a la página principal
        this.router.navigate(['/']);
        return false;
      }
    } catch (error) {
      console.error('Error en AdminGuard:', error);
      this.router.navigate(['/']);
      return false;
    }
  }
}