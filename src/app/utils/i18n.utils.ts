export class I18nUtils {
  // Formatear número según localización
  static formatNumber(value: number, locale: string = 'es-PE'): string {
    return value.toLocaleString(locale);
  }

  // Formatear moneda según localización
  static formatCurrency(value: number, currency: string = 'PEN', locale: string = 'es-PE'): string {
    return value.toLocaleString(locale, {
      style: 'currency',
      currency: currency
    });
  }

  // Formatear porcentaje según localización
  static formatPercentage(value: number, locale: string = 'es-PE'): string {
    return value.toLocaleString(locale, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Obtener nombre del mes
  static getMonthName(monthIndex: number, locale: string = 'es-PE'): string {
    const date = new Date();
    date.setMonth(monthIndex);
    return date.toLocaleDateString(locale, { month: 'long' });
  }

  // Obtener nombre del día
  static getWeekdayName(weekdayIndex: number, locale: string = 'es-PE'): string {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + weekdayIndex);
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }
}