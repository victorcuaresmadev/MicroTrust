export class NavigationUtils {
  // Navegar a una ruta
  static navigateTo(route: string): void {
    if (typeof window !== 'undefined') {
      window.location.hash = route;
    }
  }

  // Obtener parámetros de la URL
  static getUrlParams(): URLSearchParams {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  }

  // Obtener un parámetro específico de la URL
  static getUrlParam(param: string): string | null {
    const params = this.getUrlParams();
    return params.get(param);
  }

  // Actualizar parámetros de la URL
  static updateUrlParams(params: Record<string, string>): void {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      
      Object.keys(params).forEach(key => {
        urlParams.set(key, params[key]);
      });
      
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }

  // Eliminar parámetros de la URL
  static removeUrlParams(...params: string[]): void {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      
      params.forEach(param => {
        urlParams.delete(param);
      });
      
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }
}