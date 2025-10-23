import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme/theme.service';
import { WalletService } from '../../services/wallet.service';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  account: string | null = null;
  chainId: string | null = null;
  isAdmin: boolean = false;
  isAdminView: boolean = false;

  constructor(
    public themeService: ThemeService,
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
        this.chainId = await this.walletService.getChainId();
        this.isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.some(
          adminAddr => adminAddr.toLowerCase() === this.account!.toLowerCase()
        );
      }
    } catch (error) {
      console.log('No hay conexión con MetaMask');
    }
  }

  toggleAdminView() {
    this.isAdminView = !this.isAdminView;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}