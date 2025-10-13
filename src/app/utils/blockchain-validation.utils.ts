export class BlockchainValidationUtils {
  // Validar dirección de Ethereum
  static validateEthereumAddress(address: string): boolean {
    if (typeof address !== 'string') return false;
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  }

  // Validar clave privada
  static validatePrivateKey(privateKey: string): boolean {
    if (typeof privateKey !== 'string') return false;
    const privateKeyRegex = /^0x[a-fA-F0-9]{64}$/;
    return privateKeyRegex.test(privateKey);
  }

  // Validar firma digital
  static validateSignature(signature: string): boolean {
    if (typeof signature !== 'string') return false;
    const signatureRegex = /^0x[a-fA-F0-9]{130}$/;
    return signatureRegex.test(signature);
  }

  // Validar hash de transacción
  static validateTransactionHash(hash: string): boolean {
    if (typeof hash !== 'string') return false;
    const hashRegex = /^0x[a-fA-F0-9]{64}$/;
    return hashRegex.test(hash);
  }

  // Validar hash de bloque
  static validateBlockHash(hash: string): boolean {
    if (typeof hash !== 'string') return false;
    const hashRegex = /^0x[a-fA-F0-9]{64}$/;
    return hashRegex.test(hash);
  }

  // Validar número de bloque
  static validateBlockNumber(blockNumber: number): boolean {
    return Number.isInteger(blockNumber) && blockNumber >= 0;
  }

  // Validar gas limit
  static validateGasLimit(gasLimit: number): boolean {
    return Number.isInteger(gasLimit) && gasLimit > 0 && gasLimit <= 10000000; // Límite razonable
  }

  // Validar gas price
  static validateGasPrice(gasPrice: string): boolean {
    if (typeof gasPrice !== 'string') return false;
    const gasPriceRegex = /^\d+$/;
    return gasPriceRegex.test(gasPrice);
  }

  // Validar chain ID
  static validateChainId(chainId: number): boolean {
    return Number.isInteger(chainId) && chainId > 0;
  }

  // Validar balance
  static validateBalance(balance: string): boolean {
    if (typeof balance !== 'string') return false;
    const balanceRegex = /^\d+\.?\d*$/;
    return balanceRegex.test(balance);
  }

  // Validar nonce
  static validateNonce(nonce: number): boolean {
    return Number.isInteger(nonce) && nonce >= 0;
  }

  // Validar contrato inteligente
  static validateSmartContract(contract: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!contract || typeof contract !== 'object') {
      errors.push('El contrato no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar dirección del contrato
    if (!contract.address || !this.validateEthereumAddress(contract.address)) {
      errors.push('La dirección del contrato no es válida');
    }
    
    // Validar ABI
    if (!contract.abi || !Array.isArray(contract.abi)) {
      errors.push('El ABI del contrato es requerido y debe ser un array');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar evento de contrato
  static validateContractEvent(event: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!event || typeof event !== 'object') {
      errors.push('El evento no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del evento
    if (!event.name || typeof event.name !== 'string') {
      errors.push('El nombre del evento es requerido');
    }
    
    // Validar datos del evento
    if (!event.data || typeof event.data !== 'object') {
      errors.push('Los datos del evento son requeridos');
    }
    
    // Validar bloque del evento
    if (!event.blockNumber || !this.validateBlockNumber(event.blockNumber)) {
      errors.push('El número de bloque del evento no es válido');
    }
    
    // Validar hash de transacción
    if (!event.transactionHash || !this.validateTransactionHash(event.transactionHash)) {
      errors.push('El hash de transacción del evento no es válido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar transacción
  static validateTransaction(transaction: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!transaction || typeof transaction !== 'object') {
      errors.push('La transacción no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar hash de transacción
    if (!transaction.hash || !this.validateTransactionHash(transaction.hash)) {
      errors.push('El hash de transacción no es válido');
    }
    
    // Validar dirección del emisor
    if (!transaction.from || !this.validateEthereumAddress(transaction.from)) {
      errors.push('La dirección del emisor no es válida');
    }
    
    // Validar dirección del receptor (opcional para contratos)
    if (transaction.to && !this.validateEthereumAddress(transaction.to)) {
      errors.push('La dirección del receptor no es válida');
    }
    
    // Validar valor
    if (transaction.value !== undefined && !this.validateBalance(transaction.value)) {
      errors.push('El valor de la transacción no es válido');
    }
    
    // Validar gas limit
    if (transaction.gas !== undefined && !this.validateGasLimit(transaction.gas)) {
      errors.push('El gas limit de la transacción no es válido');
    }
    
    // Validar gas price
    if (transaction.gasPrice !== undefined && !this.validateGasPrice(transaction.gasPrice)) {
      errors.push('El gas price de la transacción no es válido');
    }
    
    // Validar nonce
    if (transaction.nonce !== undefined && !this.validateNonce(transaction.nonce)) {
      errors.push('El nonce de la transacción no es válido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}