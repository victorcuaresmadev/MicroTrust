export class PerformanceUtils {
  // Medir tiempo de ejecución de una función
  static async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; executionTime: number }> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const executionTime = end - start;
    
    return { result, executionTime };
  }

  // Medir tiempo de ejecución de una función sincrónica
  static measureSyncExecutionTime<T>(fn: () => T): { result: T; executionTime: number } {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const executionTime = end - start;
    
    return { result, executionTime };
  }

  // Crear un debounce para funciones
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: any;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Crear un throttle para funciones
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}