import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'MicroTrust';
  subtitle = 'Plataforma de Microcréditos Descentralizada';
  account: string | null = null;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  
  features = [
    {
      title: 'Préstamos Rápidos',
      description: 'Obtén préstamos en minutos directamente a tu wallet'
    },
    {
      title: 'Transparencia Total',
      description: 'Todos los términos y condiciones visibles en blockchain'
    },
    {
      title: 'Bajos Intereses',
      description: 'Tasas competitivas adaptadas a tus necesidades'
    },
    {
      title: 'Sin Garantías',
      description: 'Accede a créditos sin necesidad de aval ni garantía'
    }
  ];

  constructor(
    private walletService: WalletService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const accounts = await this.walletService.getAccounts();
      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
        this.checkAdminStatus();
        // Redirección automática después de verificar la cuenta
        this.redirectBasedOnRole(false); // false = no mostrar mensaje
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  }

  async connect() {
    this.isLoading = true;
    try {
      this.account = await this.walletService.connect();
      if (this.account) {
        this.checkAdminStatus();
        // Redirección automática después de login
        this.redirectBasedOnRole(true); // true = mostrar mensaje
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      this.isLoading = false;
    }
  }

  disconnect() {
    // En una implementación real, aquí se desconectaría la wallet
    // Por ahora, simplemente limpiamos el estado local
    this.account = null;
    this.isAdmin = false;
    // Recargar la página para reflejar el cambio
    window.location.reload();
  }

  checkAdminStatus() {
    if (this.account) {
      this.isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.includes(this.account);
    }
  }

  redirectBasedOnRole(showMessage: boolean) {
    // Redirección automática después de login
    if (showMessage) {
      // Mostrar mensaje de redirección
      setTimeout(() => {
        if (this.isAdmin) {
          this.router.navigate(['/admin']);
        } else if (this.account) {
          // Para clientes, podemos mostrar la página principal con acceso a funcionalidades
          // o redirigir directamente a solicitar préstamo
          this.router.navigate(['/solicitar-prestamo']);
        }
      }, 1500);
    } else {
      // Redirección inmediata sin mensaje
      if (this.isAdmin) {
        this.router.navigate(['/admin']);
      } else if (this.account) {
        // Para clientes, mostramos la página principal con acceso a funcionalidades
        // No redirigimos automáticamente para que puedan ver la información
      }
    }
  }
}