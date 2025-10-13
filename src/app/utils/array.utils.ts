export class ArrayUtils {
  // Verificar si un array está vacío
  static isEmpty(array: any[]): boolean {
    return !array || array.length === 0;
  }

  // Verificar si un array no está vacío
  static isNotEmpty(array: any[]): boolean {
    return array && array.length > 0;
  }

  // Obtener elemento aleatorio de un array
  static getRandomElement<T>(array: T[]): T | undefined {
    if (this.isEmpty(array)) return undefined;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  // Eliminar duplicados de un array
  static removeDuplicates<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  // Ordenar array de objetos por propiedad
  static sortByProperty<T>(array: T[], property: keyof T, ascending: boolean = true): T[] {
    return array.sort((a, b) => {
      const aVal = a[property];
      const bVal = b[property];
      
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  }

  // Agrupar array de objetos por propiedad
  static groupBy<T>(array: T[], property: keyof T): Record<string, T[]> {
    return array.reduce((groups: Record<string, T[]>, item: T) => {
      const group = String(item[property]);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  }

  // Encontrar elemento por propiedad
  static findByProperty<T>(array: T[], property: keyof T, value: any): T | undefined {
    return array.find(item => item[property] === value);
  }

  // Filtrar elementos por propiedad
  static filterByProperty<T>(array: T[], property: keyof T, value: any): T[] {
    return array.filter(item => item[property] === value);
  }
}