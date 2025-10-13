export class WalletValidationUtils {
  // Validar dirección de Ethereum
  static validateEthereumAddress(address: string): boolean {
    if (!address) return false;
    // Expresión regular para direcciones Ethereum
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  }

  // Validar formato de clave privada
  static validatePrivateKey(privateKey: string): boolean {
    if (!privateKey) return false;
    // Verificar que comience con 0x y tenga 64 caracteres hexadecimales
    const privateKeyRegex = /^0x[a-fA-F0-9]{64}$/;
    return privateKeyRegex.test(privateKey);
  }

  // Validar firma
  static validateSignature(signature: string): boolean {
    if (!signature) return false;
    // Verificar que tenga el formato de firma Ethereum
    const signatureRegex = /^0x[a-fA-F0-9]{130}$/;
    return signatureRegex.test(signature);
  }

  // Validar mensaje firmado
  static validateSignedMessage(message: string): boolean {
    return typeof message === 'string' && message.length > 0;
  }

  // Validar cadena ID
  static validateChainId(chainId: string): boolean {
    if (!chainId) return false;
    // Verificar que sea un número hexadecimal
    const chainIdRegex = /^0x[a-fA-F0-9]+$/;
    return chainIdRegex.test(chainId);
  }

  // Validar balance
  static validateBalance(balance: string): boolean {
    if (!balance) return false;
    // Verificar que sea un número válido
    const balanceRegex = /^\d+\.?\d*$/;
    return balanceRegex.test(balance);
  }

  // Validar transacción hash
  static validateTransactionHash(hash: string): boolean {
    if (!hash) return false;
    // Verificar que tenga el formato de hash de transacción Ethereum
    const hashRegex = /^0x[a-fA-F0-9]{64}$/;
    return hashRegex.test(hash);
  }
}