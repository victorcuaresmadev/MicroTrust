export class ValidationUtils {
  // Validar dirección de Ethereum
  static isValidEthereumAddress(address: string): boolean {
    if (!address) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Validar monto de préstamo
  static isValidLoanAmount(amount: number, limit: number): boolean {
    if (!amount) return false;
    return amount > 0 && amount <= limit;
  }

  // Validar nombre del solicitante
  static isValidBorrowerName(name: string): boolean {
    if (!name) return false;
    const trimmed = name.trim();
    return trimmed.length >= 3 && trimmed.length <= 100;
  }

  // Validar propósito del préstamo
  static isValidLoanPurpose(purpose: string): boolean {
    if (!purpose) return false;
    const trimmed = purpose.trim();
    return trimmed.length >= 10 && trimmed.length <= 500;
  }

  // Validar tipo de propósito
  static isValidPurposeType(type: string): boolean {
    return ['student', 'business', 'other'].includes(type);
  }

  // Validar red blockchain
  static isValidNetwork(network: string): boolean {
    return ['goerli', 'holesky', 'sepolia', 'hoodi', 'ephemery'].includes(network);
  }
}