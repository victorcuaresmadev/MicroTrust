export class ObjectUtils {
  // Verificar si un objeto está vacío
  static isEmpty(obj: Record<string, any>): boolean {
    return !obj || Object.keys(obj).length === 0;
  }

  // Verificar si un objeto no está vacío
  static isNotEmpty(obj: Record<string, any>): boolean {
    return obj && Object.keys(obj).length > 0;
  }

  // Copiar objeto (shallow copy)
  static shallowCopy<T>(obj: T): T {
    if (!obj) return obj;
    return { ...obj as any };
  }

  // Copiar objeto (deep copy)
  static deepCopy<T>(obj: T): T {
    if (!obj) return obj;
    return JSON.parse(JSON.stringify(obj));
  }

  // Combinar objetos
  static merge<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1 as any, ...obj2 as any };
  }

  // Obtener claves de un objeto
  static getKeys(obj: Record<string, any>): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // Obtener valores de un objeto
  static getValues(obj: Record<string, any>): any[] {
    return obj ? Object.values(obj) : [];
  }

  // Verificar si un objeto tiene una propiedad
  static hasProperty(obj: Record<string, any>, property: string): boolean {
    return obj && Object.prototype.hasOwnProperty.call(obj, property);
  }

  // Obtener valor seguro de un objeto
  static getSafe<T>(obj: Record<string, any>, path: string, defaultValue: T = undefined as any): T {
    if (!obj) return defaultValue;
    
    const keys = path.split('.');
    let current: any = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    
    return current;
  }
}