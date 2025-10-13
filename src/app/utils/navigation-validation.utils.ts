export class NavigationValidationUtils {
  // Validar ruta
  static validateRoute(route: string): boolean {
    if (!route) return false;
    
    // Verificar que sea una cadena no vacía
    return typeof route === 'string' && route.trim().length > 0;
  }

  // Validar parámetros de ruta
  static validateRouteParams(params: Record<string, any>): boolean {
    if (!params) return true; // Los parámetros son opcionales
    
    // Verificar que sea un objeto
    return typeof params === 'object';
  }

  // Validar query parameters
  static validateQueryParams(queryParams: Record<string, string>): boolean {
    if (!queryParams) return true; // Los query params son opcionales
    
    // Verificar que todas las claves y valores sean strings
    for (const [key, value] of Object.entries(queryParams)) {
      if (typeof key !== 'string' || typeof value !== 'string') {
        return false;
      }
    }
    
    return true;
  }

  // Validar fragmento de URL
  static validateFragment(fragment: string): boolean {
    if (!fragment) return true; // El fragmento es opcional
    
    // Verificar que sea una cadena
    return typeof fragment === 'string';
  }

  // Validar estado de navegación
  static validateNavigationState(state: any): boolean {
    if (!state) return true; // El estado es opcional
    
    // Verificar que sea un objeto
    return typeof state === 'object';
  }

  // Validar objeto de navegación completo
  static validateNavigationObject(navigation: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validar ruta
    if (!this.validateRoute(navigation.route)) {
      errors.push('La ruta no es válida');
    }
    
    // Validar parámetros
    if (!this.validateRouteParams(navigation.params)) {
      errors.push('Los parámetros de ruta no son válidos');
    }
    
    // Validar query params
    if (!this.validateQueryParams(navigation.queryParams)) {
      errors.push('Los query parameters no son válidos');
    }
    
    // Validar fragmento
    if (!this.validateFragment(navigation.fragment)) {
      errors.push('El fragmento no es válido');
    }
    
    // Validar estado
    if (!this.validateNavigationState(navigation.state)) {
      errors.push('El estado de navegación no es válido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}