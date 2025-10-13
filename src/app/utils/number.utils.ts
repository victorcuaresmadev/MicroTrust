export class NumberUtils {
  // Verificar si un valor es un número válido
  static isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  // Verificar si un número es positivo
  static isPositive(value: number): boolean {
    return this.isValidNumber(value) && value > 0;
  }

  // Verificar si un número es negativo
  static isNegative(value: number): boolean {
    return this.isValidNumber(value) && value < 0;
  }

  // Verificar si un número es cero
  static isZero(value: number): boolean {
    return this.isValidNumber(value) && value === 0;
  }

  // Redondear a un número específico de decimales
  static roundToDecimal(value: number, decimals: number): number {
    if (!this.isValidNumber(value)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  // Formatear número con separadores de miles
  static formatWithThousandsSeparator(value: number, locale: string = 'es-PE'): string {
    if (!this.isValidNumber(value)) return '0';
    return value.toLocaleString(locale);
  }

  // Generar número aleatorio entre min y max
  static randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Verificar si un número está en un rango
  static isInRange(value: number, min: number, max: number): boolean {
    return this.isValidNumber(value) && value >= min && value <= max;
  }

  // Convertir porcentaje a decimal
  static percentageToDecimal(percentage: number): number {
    return percentage / 100;
  }

  // Convertir decimal a porcentaje
  static decimalToPercentage(decimal: number): number {
    return decimal * 100;
  }

  // Calcular porcentaje de un número
  static calculatePercentage(value: number, percentage: number): number {
    return value * (percentage / 100);
  }

  // Calcular diferencia porcentual
  static calculatePercentageDifference(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }
}