export class FormatUtils {
  // Formatear dirección de wallet
  static formatWalletAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  // Formatear fechas
  static formatDate(date: Date): string {
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Formatear montos
  static formatAmount(amount: number): string {
    return amount.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Generar ID único
  static generateId(prefix: string = ''): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Formatear porcentaje
  static formatPercentage(rate: number): string {
    return `${(rate * 100).toFixed(2)}%`;
  }
}