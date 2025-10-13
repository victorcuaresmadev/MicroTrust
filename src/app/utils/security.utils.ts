export class SecurityUtils {
  // Sanitizar entrada de texto
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Eliminar etiquetas HTML
    let sanitized = input.replace(/<[^>]*>?/gm, '');
    
    // Eliminar caracteres peligrosos
    sanitized = sanitized.replace(/[<>]/g, '');
    
    return sanitized.trim();
  }

  // Validar entrada de texto
  static isValidInput(input: string, maxLength: number = 500): boolean {
    if (!input) return true;
    
    // Verificar longitud
    if (input.length > maxLength) return false;
    
    // Verificar caracteres peligrosos
    if (/[<>]/.test(input)) return false;
    
    return true;
  }

  // Generar hash simple (para uso interno)
  static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Verificar si una cadena contiene scripts
  static containsScript(input: string): boolean {
    if (!input) return false;
    
    const scriptPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];
    
    return scriptPatterns.some(pattern => pattern.test(input));
  }
}