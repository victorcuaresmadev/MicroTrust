export class ArrayValidationUtils {
  // Validar que sea un array
  static validateArray(array: any): boolean {
    return Array.isArray(array);
  }

  // Validar que un array no esté vacío
  static validateNonEmptyArray(array: any): boolean {
    return Array.isArray(array) && array.length > 0;
  }

  // Validar longitud de array
  static validateArrayLength(array: any, minLength: number, maxLength: number): boolean {
    if (!Array.isArray(array)) return false;
    
    return array.length >= minLength && array.length <= maxLength;
  }

  // Validar elementos de array
  static validateArrayElements<T>(
    array: T[],
    validator: (element: T) => boolean
  ): { isValid: boolean; invalidElements: T[] } {
    if (!Array.isArray(array)) {
      return { isValid: false, invalidElements: [] };
    }
    
    const invalidElements: T[] = [];
    
    for (const element of array) {
      if (!validator(element)) {
        invalidElements.push(element);
      }
    }
    
    return {
      isValid: invalidElements.length === 0,
      invalidElements
    };
  }

  // Validar array de strings
  static validateStringArray(array: any): boolean {
    if (!Array.isArray(array)) return false;
    
    return array.every(item => typeof item === 'string');
  }

  // Validar array de números
  static validateNumberArray(array: any): boolean {
    if (!Array.isArray(array)) return false;
    
    return array.every(item => typeof item === 'number' && !isNaN(item));
  }

  // Validar array de objetos
  static validateObjectArray(array: any): boolean {
    if (!Array.isArray(array)) return false;
    
    return array.every(item => typeof item === 'object' && item !== null);
  }

  // Validar array con elementos únicos
  static validateUniqueArray(array: any): boolean {
    if (!Array.isArray(array)) return false;
    
    const uniqueElements = new Set(array);
    return uniqueElements.size === array.length;
  }

  // Validar array con elementos ordenados
  static validateSortedArray(
    array: any[],
    ascending: boolean = true
  ): boolean {
    if (!Array.isArray(array)) return false;
    
    for (let i = 1; i < array.length; i++) {
      if (ascending) {
        if (array[i] < array[i - 1]) return false;
      } else {
        if (array[i] > array[i - 1]) return false;
      }
    }
    
    return true;
  }

  // Validar array multidimensional
  static validateMultiDimensionalArray(array: any): boolean {
    if (!Array.isArray(array)) return false;
    
    return array.every(subArray => Array.isArray(subArray));
  }
}