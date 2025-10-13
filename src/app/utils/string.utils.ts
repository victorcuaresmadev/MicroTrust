export class StringUtils {
  // Verificar si una cadena está vacía
  static isEmpty(str: string): boolean {
    if (!str) return true;
    return str.trim().length === 0;
  }

  // Verificar si una cadena no está vacía
  static isNotEmpty(str: string): boolean {
    if (!str) return false;
    return str.trim().length > 0;
  }

  // Capitalizar primera letra
  static capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Capitalizar todas las palabras
  static capitalizeWords(str: string): string {
    if (!str) return str;
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  // Convertir a slug
  static toSlug(str: string): string {
    if (!str) return str;
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Truncar cadena
  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  // Eliminar espacios en blanco
  static removeWhitespace(str: string): string {
    if (!str) return str;
    return str.replace(/\s+/g, '');
  }

  // Generar cadena aleatoria
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Verificar si una cadena contiene otra (case insensitive)
  static containsIgnoreCase(str: string, search: string): boolean {
    if (!str || !search) return false;
    return str.toLowerCase().includes(search.toLowerCase());
  }

  // Reemplazar todas las ocurrencias
  static replaceAll(str: string, search: string, replacement: string): string {
    if (!str) return str;
    return str.split(search).join(replacement);
  }
}