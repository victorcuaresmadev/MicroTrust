import { Component } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  account: string | null = null;
  isAdmin: boolean = false;
  isAdminView: boolean = false;

  constructor(private wallet: WalletService) {}

  async connect() {
    try {
      const acc = await this.wallet.connect();
      this.account = acc;
      this.isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.includes(acc);
    } catch (e: any) {
      console.error('Error connecting wallet:', e);
    }
  }

  disconnect() {
    this.account = null;
    this.isAdmin = false;
    this.isAdminView = false;
  }

  toggleAdminView() {
    this.isAdminView = !this.isAdminView;
  }
}