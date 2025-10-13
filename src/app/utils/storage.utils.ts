export class StorageUtils {
  // Guardar datos en localStorage
  static setLocalStorage(key: string, value: any): void {
    if (typeof window !== 'undefined') {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  // Obtener datos de localStorage
  static getLocalStorage(key: string): any {
    if (typeof window !== 'undefined') {
      try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
          return null;
        }
        return JSON.parse(serializedValue);
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  // Eliminar datos de localStorage
  static removeLocalStorage(key: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  }

  // Limpiar todo localStorage
  static clearLocalStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }

  // Guardar datos en sessionStorage
  static setSessionStorage(key: string, value: any): void {
    if (typeof window !== 'undefined') {
      try {
        const serializedValue = JSON.stringify(value);
        sessionStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }
    }
  }

  // Obtener datos de sessionStorage
  static getSessionStorage(key: string): any {
    if (typeof window !== 'undefined') {
      try {
        const serializedValue = sessionStorage.getItem(key);
        if (serializedValue === null) {
          return null;
        }
        return JSON.parse(serializedValue);
      } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

  // Eliminar datos de sessionStorage
  static removeSessionStorage(key: string): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from sessionStorage:', error);
      }
    }
  }
}