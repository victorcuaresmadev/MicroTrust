import { Injectable } from '@angular/core';

declare global {
  interface Window { ethereum?: any; }
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  async connect(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) throw new Error('No se obtuvieron cuentas');
    return accounts[0];
  }

  async getAccounts(): Promise<string[]> {
    if (!window.ethereum) return [];
    return await window.ethereum.request({ method: 'eth_accounts' });
  }

  async getChainId(): Promise<string> {
    if (!window.ethereum) return '';
    return await window.ethereum.request({ method: 'eth_chainId' });
  }

  async signMessage(message: string): Promise<string> {
    if (!window.ethereum) throw new Error('MetaMask no está disponible');
    const accounts = await this.getAccounts();
    const from = accounts[0];
    if (!from) throw new Error('Cuenta no conectada');
    return await window.ethereum.request({
      method: 'personal_sign',
      params: [message, from]
    });
  }
}
