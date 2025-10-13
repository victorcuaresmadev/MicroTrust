export class DateValidationUtils {
  // Validar que sea una fecha válida
  static validateDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Validar que sea una fecha en el pasado
  static validatePastDate(date: Date): boolean {
    if (!this.validateDate(date)) return false;
    return date < new Date();
  }

  // Validar que sea una fecha en el futuro
  static validateFutureDate(date: Date): boolean {
    if (!this.validateDate(date)) return false;
    return date > new Date();
  }

  // Validar que sea una fecha en un rango
  static validateDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    if (!this.validateDate(date) || !this.validateDate(startDate) || !this.validateDate(endDate)) {
      return false;
    }
    
    return date >= startDate && date <= endDate;
  }

  // Validar formato de fecha (ISO 8601)
  static validateISODateString(dateString: string): boolean {
    if (typeof dateString !== 'string') return false;
    
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    if (!isoRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  // Validar formato de fecha corta (YYYY-MM-DD)
  static validateShortDateString(dateString: string): boolean {
    if (typeof dateString !== 'string') return false;
    
    const shortDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!shortDateRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  // Validar edad mínima
  static validateMinAge(birthDate: Date, minAge: number): boolean {
    if (!this.validateDate(birthDate)) return false;
    
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    
    return birthDate <= minBirthDate;
  }

  // Validar edad máxima
  static validateMaxAge(birthDate: Date, maxAge: number): boolean {
    if (!this.validateDate(birthDate)) return false;
    
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    
    return birthDate >= maxBirthDate;
  }

  // Validar día de la semana
  static validateWeekday(date: Date, weekday: number): boolean {
    if (!this.validateDate(date)) return false;
    return date.getDay() === weekday;
  }

  // Validar que sea fin de semana
  static validateWeekend(date: Date): boolean {
    if (!this.validateDate(date)) return false;
    const day = date.getDay();
    return day === 0 || day === 6; // Domingo o Sábado
  }

  // Validar que sea día hábil
  static validateBusinessDay(date: Date): boolean {
    if (!this.validateDate(date)) return false;
    const day = date.getDay();
    return day > 0 && day < 6; // Lunes a Viernes
  }

  // Validar diferencia de fechas
  static validateDateDifference(
    startDate: Date,
    endDate: Date,
    maxDifferenceDays: number
  ): boolean {
    if (!this.validateDate(startDate) || !this.validateDate(endDate)) return false;
    
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return dayDiff <= maxDifferenceDays;
  }

  // Validar hora del día
  static validateTimeOfDay(date: Date, startHour: number, endHour: number): boolean {
    if (!this.validateDate(date)) return false;
    
    const hour = date.getHours();
    return hour >= startHour && hour <= endHour;
  }
}