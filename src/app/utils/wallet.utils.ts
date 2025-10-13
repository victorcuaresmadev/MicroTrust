export class WalletUtils {
  // Formatear dirección de wallet
  static formatWalletAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  // Verificar si MetaMask está instalado
  static isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && (window as any).ethereum;
  }

  // Verificar si hay cuentas conectadas
  static async getConnectedAccounts(): Promise<string[]> {
    if (!this.isMetaMaskInstalled()) {
      return [];
    }
    
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
      return accounts || [];
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  }

  // Verificar si hay una cuenta activa
  static async getActiveAccount(): Promise<string | null> {
    const accounts = await this.getConnectedAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }
}