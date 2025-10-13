export class I18nValidationUtils {
  // Validar código de idioma
  static validateLanguageCode(language: string): boolean {
    if (!language) return false;
    
    // Expresión regular para códigos de idioma (ej: es, en, fr, es-PE, en-US)
    const languageRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
    return languageRegex.test(language);
  }

  // Validar código de país
  static validateCountryCode(country: string): boolean {
    if (!country) return false;
    
    // Código de país de 2 letras en mayúsculas
    const countryRegex = /^[A-Z]{2}$/;
    return countryRegex.test(country);
  }

  // Validar locale
  static validateLocale(locale: string): boolean {
    if (!locale) return false;
    
    // Formato: idioma-País (ej: es-PE, en-US)
    const localeRegex = /^[a-z]{2}-[A-Z]{2}$/;
    return localeRegex.test(locale);
  }

  // Validar mensaje de traducción
  static validateTranslationMessage(message: string): boolean {
    if (!message) return false;
    
    // Verificar que sea una cadena no vacía
    return typeof message === 'string' && message.trim().length > 0;
  }

  // Validar clave de traducción
  static validateTranslationKey(key: string): boolean {
    if (!key) return false;
    
    // Verificar que sea una cadena no vacía
    return typeof key === 'string' && key.trim().length > 0;
  }

  // Validar objeto de traducción
  static validateTranslationObject(translation: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!translation || typeof translation !== 'object') {
      errors.push('El objeto de traducción no es válido');
      return { isValid: false, errors };
    }
    
    // Validar todas las claves y valores
    for (const [key, value] of Object.entries(translation)) {
      if (!this.validateTranslationKey(key)) {
        errors.push(`La clave de traducción "${key}" no es válida`);
      }
      
      if (!this.validateTranslationMessage(value as string)) {
        errors.push(`El mensaje de traducción para la clave "${key}" no es válido`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar archivo de traducción
  static validateTranslationFile(file: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!file || typeof file !== 'object') {
      errors.push('El archivo de traducción no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Verificar que tenga las propiedades requeridas
    if (!file.language || !this.validateLanguageCode(file.language)) {
      errors.push('El archivo debe contener un código de idioma válido');
    }
    
    if (!file.translations || typeof file.translations !== 'object') {
      errors.push('El archivo debe contener un objeto de traducciones');
    } else {
      const translationValidation = this.validateTranslationObject(file.translations);
      if (!translationValidation.isValid) {
        errors.push(...translationValidation.errors);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}