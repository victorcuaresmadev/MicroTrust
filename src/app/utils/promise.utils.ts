export class PromiseUtils {
  // Esperar un tiempo determinado
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Ejecutar promesas en serie
  static async series<T>(promises: Array<() => Promise<T>>): Promise<T[]> {
    const results: T[] = [];
    
    for (const promise of promises) {
      try {
        const result = await promise();
        results.push(result);
      } catch (error) {
        throw error;
      }
    }
    
    return results;
  }

  // Ejecutar promesas en paralelo
  static async parallel<T>(promises: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(promises.map(p => p()));
  }

  // Ejecutar promesas con límite de concurrencia
  static async withConcurrencyLimit<T>(
    promises: Array<() => Promise<T>>,
    limit: number
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < promises.length; i += limit) {
      const batch = promises.slice(i, i + limit);
      const batchResults = await Promise.all(batch.map(p => p()));
      results.push(...batchResults);
    }
    
    return results;
  }

  // Reintentar una promesa
  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries) {
          await this.wait(delay);
        }
      }
    }
    
    throw lastError;
  }

  // Timeout para una promesa
  static async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), ms);
    });
    
    return Promise.race([promise, timeout]);
  }
}