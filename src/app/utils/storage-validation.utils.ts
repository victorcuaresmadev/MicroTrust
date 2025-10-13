export class StorageValidationUtils {
  // Validar clave de almacenamiento
  static validateStorageKey(key: string): boolean {
    if (!key) return false;
    
    // Verificar que sea una cadena no vacía
    return typeof key === 'string' && key.trim().length > 0;
  }

  // Validar valor de almacenamiento
  static validateStorageValue(value: any): boolean {
    // null y undefined son valores válidos (para eliminar)
    if (value === null || value === undefined) return true;
    
    // Verificar tipos válidos
    const validTypes = ['string', 'number', 'boolean', 'object'];
    const valueType = typeof value;
    
    if (!validTypes.includes(valueType)) {
      return false;
    }
    
    // Si es un objeto, verificar que sea serializable
    if (valueType === 'object') {
      try {
        JSON.stringify(value);
        return true;
      } catch {
        return false;
      }
    }
    
    return true;
  }

  // Validar tamaño de almacenamiento
  static validateStorageSize(key: string, value: any): boolean {
    try {
      const serializedKey = JSON.stringify(key);
      const serializedValue = JSON.stringify(value);
      const totalSize = serializedKey.length + serializedValue.length;
      
      // Limitar a 5MB (tamaño típico para localStorage)
      return totalSize <= 5 * 1024 * 1024;
    } catch {
      return false;
    }
  }

  // Validar objeto de almacenamiento completo
  static validateStorageObject(
    key: string,
    value: any
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validar clave
    if (!this.validateStorageKey(key)) {
      errors.push('La clave de almacenamiento no es válida');
    }
    
    // Validar valor
    if (!this.validateStorageValue(value)) {
      errors.push('El valor de almacenamiento no es válido');
    }
    
    // Validar tamaño
    if (!this.validateStorageSize(key, value)) {
      errors.push('El objeto de almacenamiento excede el tamaño máximo permitido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar operación de almacenamiento
  static validateStorageOperation(
    operation: string,
    key: string,
    value?: any
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validar operación
    const validOperations = ['set', 'get', 'remove', 'clear'];
    if (!validOperations.includes(operation)) {
      errors.push('La operación de almacenamiento no es válida');
    }
    
    // Validar clave para operaciones que la requieren
    if (['set', 'get', 'remove'].includes(operation)) {
      if (!this.validateStorageKey(key)) {
        errors.push('La clave de almacenamiento es requerida para esta operación');
      }
    }
    
    // Validar valor para operaciones que lo requieren
    if (operation === 'set') {
      if (!this.validateStorageValue(value)) {
        errors.push('El valor de almacenamiento es requerido para esta operación');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}