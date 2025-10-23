import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  account: string | null = null;
  chainId: string | null = null;
  isAdmin: boolean = false;
  showProfileMenu: boolean = false;
  balance: string = '0.0000';

  constructor(
    private wallet: WalletService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkConnection();
  }

  async checkConnection() {
    // Verificar si el usuario desconectó manualmente
    const manualDisconnect = localStorage.getItem('manual_disconnect');
    if (manualDisconnect === 'true') {
      console.log('Usuario desconectado manualmente, no reconectar');
      return;
    }
    
    try {
      const accounts = await this.wallet.getAccounts();
      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
        this.chainId = await this.wallet.getChainId();
        this.isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.some(adminAddress => 
          adminAddress.toLowerCase() === this.account?.toLowerCase()
        );
        
        // Obtener balance
        await this.updateBalance();
      }
    } catch (err: any) {
      console.log('No hay conexión previa con MetaMask');
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  async connect() {
    try {
      // Limpiar flag de desconexión manual al conectar
      localStorage.removeItem('manual_disconnect');
      
      const acc = await this.wallet.connect();
      this.account = acc;
      this.chainId = await this.wallet.getChainId();
      this.isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.some(adminAddress => 
        adminAddress.toLowerCase() === acc.toLowerCase()
      );
      
      // Obtener balance
      await this.updateBalance();
      
      // Redirigir según el rol
      if (this.isAdmin) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/client/dashboard']);
      }
    } catch (e: any) {
      console.error('Error connecting wallet:', e);
    }
  }

  disconnect() {
    // Marcar como desconexión manual para evitar reconexión automática
    localStorage.setItem('manual_disconnect', 'true');
    
    // Limpiar variables locales
    this.account = null;
    this.chainId = null;
    this.isAdmin = false;
    this.showProfileMenu = false;
    
    // Limpiar localStorage si hay datos de sesión
    localStorage.removeItem('student_verification');
    
    // Navegar a login y recargar
    this.router.navigate(['/login']).then(() => {
      // Recargar la página para limpiar completamente el estado
      window.location.reload();
    });
  }

  getNetworkName(chainId: string): string {
    const chainIdMap: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli',
      '0xaa36a7': 'Sepolia',
      '0x4268': 'Holešky',
      '0x1a4': 'Ephemery'
    };
    
    return chainIdMap[chainId] || `Chain ID: ${chainId}`;
  }

  navigateToProfile() {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
    this.showProfileMenu = false;
  }

  navigateToLoans() {
    this.router.navigate(['/mis-prestamos']);
    this.showProfileMenu = false;
  }

  navigateToRequestLoan() {
    this.router.navigate(['/solicitar-prestamo']);
    this.showProfileMenu = false;
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']);
    this.showProfileMenu = false;
  }

  openBlockchainExplorer() {
    if (!this.account || !this.chainId) {
      console.error('No hay cuenta o red conectada');
      return;
    }

    // Mapeo de chainId a URL del explorador blockchain
    const explorerMap: { [key: string]: string } = {
      '0x1': `https://etherscan.io/address/${this.account}`,           // Ethereum Mainnet
      '0x5': `https://goerli.etherscan.io/address/${this.account}`,    // Goerli
      '0xaa36a7': `https://sepolia.etherscan.io/address/${this.account}`, // Sepolia
      '0x4268': `https://holesky.etherscan.io/address/${this.account}`,   // Holešky
      '0x1a4': `https://explorer.ephemery.dev/address/${this.account}`    // Ephemery
    };

    const explorerUrl = explorerMap[this.chainId];
    
    if (explorerUrl) {
      // Abrir en nueva pestaña
      window.open(explorerUrl, '_blank');
      this.showProfileMenu = false;
    } else {
      console.error('Explorador no disponible para esta red:', this.chainId);
    }
  }

  async updateBalance() {
    if (!this.account || !window.ethereum) {
      this.balance = '0.0000';
      return;
    }

    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [this.account, 'latest']
      });
      
      // Convertir de Wei a ETH
      const balanceInWei = parseInt(balanceHex, 16);
      const balanceInEth = balanceInWei / 1e18;
      
      // Formatear con 4 decimales
      this.balance = balanceInEth.toFixed(4);
    } catch (error) {
      console.error('Error al obtener balance:', error);
      this.balance = '0.0000';
    }
  }

  async switchToNetwork(network: string) {
    try {
      await this.wallet.switchNetwork(network);
      this.chainId = await this.wallet.getChainId();
      await this.updateBalance();
      this.showProfileMenu = false;
    } catch (error) {
      console.error('Error al cambiar de red:', error);
    }
  }
}