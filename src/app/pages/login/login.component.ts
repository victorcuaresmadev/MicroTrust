import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { ThemeService } from '../../services/theme/theme.service';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error = '';
  account = '';
  chainId = '';
  isAdmin = false;

  constructor(
    private walletService: WalletService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.checkConnection();
  }

  async connect(): Promise<void> {
    this.isLoading = true;
    this.error = '';

    try {
      // Limpiar flag de desconexión manual al conectar
      localStorage.removeItem('manual_disconnect');
      
      const accounts = await this.walletService.connect();
      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
        this.chainId = await this.walletService.getChainId();
        this.checkAdminStatus();
        this.redirectAfterLogin();
      }
    } catch (error: any) {
      this.error = error.message || 'Error al conectar con MetaMask';
    } finally {
      this.isLoading = false;
    }
  }

  async checkConnection(): Promise<void> {
    // Verificar si el usuario desconectó manualmente
    const manualDisconnect = localStorage.getItem('manual_disconnect');
    if (manualDisconnect === 'true') {
      console.log('Usuario desconectado manualmente, esperando nueva conexión');
      return;
    }
    
    try {
      const accounts = await this.walletService.getAccounts();
      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
        this.chainId = await this.walletService.getChainId();
        this.checkAdminStatus();
        this.redirectAfterLogin();
      }
    } catch (error) {
      // No hay conexión activa
    }
  }

  private checkAdminStatus(): void {
    this.isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.some(
      adminAddr => adminAddr.toLowerCase() === this.account.toLowerCase()
    );
  }

  private redirectAfterLogin(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}