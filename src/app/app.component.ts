import { Component } from '@angular/core';
import { WalletService } from './services/wallet.service';
import { APP_CONSTANTS } from './constants/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WalletService]
})
export class AppComponent {
  title = 'MicroTrust';
  account: string | null = null;
  chainId: string | null = null;
  error: string | null = null;

  constructor(private wallet: WalletService) {}

  async connect() {
    this.error = null;
    try {
      const acc = await this.wallet.connect();
      this.account = acc;
      this.chainId = await this.wallet.getChainId();
    } catch (e: any) {
      this.error = e?.message || String(e);
    }
  }

  async disconnect() {
    this.account = null;
    this.chainId = null;
  }

  async sign() {
    if (!this.account) { this.error = 'Conecta primero la wallet.'; return; }
    try {
      const sig = await this.wallet.signMessage('Prueba microcreditos');
      alert('Signature: ' + sig);
    } catch (e: any) {
      this.error = e?.message || String(e);
    }
  }

  isAdmin(): boolean {
    return this.account ? APP_CONSTANTS.ADMIN_ADDRESSES.includes(this.account) : false;
  }
}