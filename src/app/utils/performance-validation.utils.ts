export class PerformanceValidationUtils {
  // Validar métrica de tiempo
  static validateTimeMetric(time: number): boolean {
    return typeof time === 'number' && time >= 0 && isFinite(time);
  }

  // Validar métrica de tamaño
  static validateSizeMetric(size: number): boolean {
    return typeof size === 'number' && size >= 0 && isFinite(size);
  }

  // Validar porcentaje
  static validatePercentage(percentage: number): boolean {
    return typeof percentage === 'number' && percentage >= 0 && percentage <= 100;
  }

  // Validar FPS
  static validateFps(fps: number): boolean {
    return typeof fps === 'number' && fps >= 0 && fps <= 120;
  }

  // Validar métrica de performance
  static validatePerformanceMetric(metric: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!metric || typeof metric !== 'object') {
      errors.push('La métrica de performance no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre
    if (!metric.name || typeof metric.name !== 'string') {
      errors.push('name es requerido y debe ser una cadena');
    }
    
    // Validar valor
    if (!('value' in metric)) {
      errors.push('value es requerido');
    } else {
      if (typeof metric.value !== 'number') {
        errors.push('value debe ser un número');
      } else if (!isFinite(metric.value)) {
        errors.push('value debe ser un número finito');
      }
    }
    
    // Validar unidad (opcional)
    if ('unit' in metric) {
      if (typeof metric.unit !== 'string') {
        errors.push('unit debe ser una cadena');
      }
    }
    
    // Validar timestamp
    if (!metric.timestamp || !(metric.timestamp instanceof Date) || isNaN(metric.timestamp.getTime())) {
      errors.push('timestamp es requerido y debe ser una fecha válida');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar reporte de performance
  static validatePerformanceReport(report: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!report || typeof report !== 'object') {
      errors.push('El reporte de performance no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar ID
    if (!report.id || typeof report.id !== 'string') {
      errors.push('id es requerido y debe ser una cadena');
    }
    
    // Validar fecha de inicio
    if (!report.startTime || !(report.startTime instanceof Date) || isNaN(report.startTime.getTime())) {
      errors.push('startTime es requerido y debe ser una fecha válida');
    }
    
    // Validar fecha de fin
    if (!report.endTime || !(report.endTime instanceof Date) || isNaN(report.endTime.getTime())) {
      errors.push('endTime es requerido y debe ser una fecha válida');
    }
    
    // Validar duración
    if (!('duration' in report) || typeof report.duration !== 'number' || report.duration < 0) {
      errors.push('duration es requerida y debe ser un número no negativo');
    }
    
    // Validar métricas
    if (!('metrics' in report) || !Array.isArray(report.metrics)) {
      errors.push('metrics es requerido y debe ser un array');
    } else {
      for (const metric of report.metrics) {
        const metricValidation = this.validatePerformanceMetric(metric);
        if (!metricValidation.isValid) {
          errors.push(...metricValidation.errors.map(err => `metric error: ${err}`));
        }
      }
    }
    
    // Validar scores (opcional)
    if ('scores' in report) {
      if (typeof report.scores !== 'object') {
        errors.push('scores debe ser un objeto');
      } else {
        for (const [key, value] of Object.entries(report.scores)) {
          if (typeof key !== 'string') {
            errors.push('Las claves de scores deben ser cadenas');
            break;
          }
          
          if (typeof value !== 'number' || value < 0 || value > 100) {
            errors.push(`El valor de score ${key} debe ser un número entre 0 y 100`);
            break;
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar threshold de performance
  static validatePerformanceThreshold(threshold: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!threshold || typeof threshold !== 'object') {
      errors.push('El threshold de performance no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar métrica
    if (!threshold.metric || typeof threshold.metric !== 'string') {
      errors.push('metric es requerida y debe ser una cadena');
    }
    
    // Validar valor límite
    if (!('value' in threshold) || typeof threshold.value !== 'number') {
      errors.push('value es requerido y debe ser un número');
    }
    
    // Validar operador
    if (!threshold.operator || typeof threshold.operator !== 'string') {
      errors.push('operator es requerido y debe ser una cadena');
    } else {
      const validOperators = ['>', '<', '>=', '<=', '==', '!='];
      if (!validOperators.includes(threshold.operator)) {
        errors.push(`operator debe ser uno de: ${validOperators.join(', ')}`);
      }
    }
    
    // Validar acción (opcional)
    if ('action' in threshold) {
      if (typeof threshold.action !== 'string') {
        errors.push('action debe ser una cadena');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar benchmark
  static validateBenchmark(benchmark: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!benchmark || typeof benchmark !== 'object') {
      errors.push('El benchmark no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre
    if (!benchmark.name || typeof benchmark.name !== 'string') {
      errors.push('name es requerido y debe ser una cadena');
    }
    
    // Validar operaciones
    if (!('operations' in benchmark) || typeof benchmark.operations !== 'number' || benchmark.operations <= 0) {
      errors.push('operations es requerido y debe ser un número positivo');
    }
    
    // Validar tiempo promedio
    if (!('averageTime' in benchmark) || typeof benchmark.averageTime !== 'number' || benchmark.averageTime < 0) {
      errors.push('averageTime es requerido y debe ser un número no negativo');
    }
    
    // Validar tiempo mínimo
    if (!('minTime' in benchmark) || typeof benchmark.minTime !== 'number' || benchmark.minTime < 0) {
      errors.push('minTime es requerido y debe ser un número no negativo');
    }
    
    // Validar tiempo máximo
    if (!('maxTime' in benchmark) || typeof benchmark.maxTime !== 'number' || benchmark.maxTime < 0) {
      errors.push('maxTime es requerido y debe ser un número no negativo');
    }
    
    // Validar desviación estándar (opcional)
    if ('stdDeviation' in benchmark) {
      if (typeof benchmark.stdDeviation !== 'number' || benchmark.stdDeviation < 0) {
        errors.push('stdDeviation debe ser un número no negativo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de monitoreo de performance
  static validatePerformanceMonitoringConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de monitoreo de performance no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar intervalo de muestreo (opcional)
    if ('samplingInterval' in config) {
      if (typeof config.samplingInterval !== 'number' || config.samplingInterval <= 0) {
        errors.push('samplingInterval debe ser un número positivo');
      }
    }
    
    // Validar umbral de alerta (opcional)
    if ('alertThreshold' in config) {
      if (typeof config.alertThreshold !== 'number' || config.alertThreshold <= 0) {
        errors.push('alertThreshold debe ser un número positivo');
      }
    }
    
    // Validar métricas a monitorear (opcional)
    if ('metricsToMonitor' in config) {
      if (!Array.isArray(config.metricsToMonitor)) {
        errors.push('metricsToMonitor debe ser un array');
      } else {
        for (const metric of config.metricsToMonitor) {
          if (typeof metric !== 'string') {
            errors.push('Cada métrica debe ser una cadena');
            break;
          }
        }
      }
    }
    
    // Validar reporte automático (opcional)
    if ('autoReport' in config) {
      if (typeof config.autoReport !== 'boolean') {
        errors.push('autoReport debe ser un valor booleano');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar métrica de carga
  static validateLoadMetric(metric: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!metric || typeof metric !== 'object') {
      errors.push('La métrica de carga no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo de métrica
    if (!metric.type || typeof metric.type !== 'string') {
      errors.push('type es requerido y debe ser una cadena');
    } else {
      const validTypes = ['navigation', 'resource', 'paint', 'longtask'];
      if (!validTypes.includes(metric.type)) {
        errors.push(`type debe ser uno de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar nombre
    if (!metric.name || typeof metric.name !== 'string') {
      errors.push('name es requerido y debe ser una cadena');
    }
    
    // Validar duración
    if (!('duration' in metric) || typeof metric.duration !== 'number' || metric.duration < 0) {
      errors.push('duration es requerida y debe ser un número no negativo');
    }
    
    // Validar timestamp
    if (!metric.timestamp || !(metric.timestamp instanceof Date) || isNaN(metric.timestamp.getTime())) {
      errors.push('timestamp es requerido y debe ser una fecha válida');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar métrica de memoria
  static validateMemoryMetric(metric: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!metric || typeof metric !== 'object') {
      errors.push('La métrica de memoria no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar uso de memoria
    if (!('used' in metric) || typeof metric.used !== 'number' || metric.used < 0) {
      errors.push('used es requerido y debe ser un número no negativo');
    }
    
    // Validar memoria total
    if (!('total' in metric) || typeof metric.total !== 'number' || metric.total < 0) {
      errors.push('total es requerido y debe ser un número no negativo');
    }
    
    // Validar timestamp
    if (!metric.timestamp || !(metric.timestamp instanceof Date) || isNaN(metric.timestamp.getTime())) {
      errors.push('timestamp es requerido y debe ser una fecha válida');
    }
    
    // Validar que el uso no exceda el total
    if (metric.used > metric.total) {
      errors.push('El uso de memoria no puede exceder la memoria total');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}