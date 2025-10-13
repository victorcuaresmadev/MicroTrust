export class SeoValidationUtils {
  // Validar título SEO
  static validateSeoTitle(title: string): boolean {
    return typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 60;
  }

  // Validar descripción SEO
  static validateSeoDescription(description: string): boolean {
    return typeof description === 'string' && description.trim().length > 0 && description.trim().length <= 160;
  }

  // Validar URL amigable
  static validateFriendlyUrl(url: string): boolean {
    if (typeof url !== 'string') return false;
    const urlRegex = /^[a-z0-9\-\/]+$/;
    return urlRegex.test(url);
  }

  // Validar meta tag
  static validateMetaTag(tag: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!tag || typeof tag !== 'object') {
      errors.push('La meta tag no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre o propiedad
    if (!tag.name && !tag.property) {
      errors.push('name o property es requerido');
    } else if (tag.name && typeof tag.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (tag.property && typeof tag.property !== 'string') {
      errors.push('property debe ser una cadena');
    }
    
    // Validar contenido
    if (!tag.content || typeof tag.content !== 'string') {
      errors.push('content es requerido y debe ser una cadena');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración SEO
  static validateSeoConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración SEO no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar título por defecto (opcional)
    if ('defaultTitle' in config && !this.validateSeoTitle(config.defaultTitle)) {
      errors.push('defaultTitle no es válido');
    }
    
    // Validar descripción por defecto (opcional)
    if ('defaultDescription' in config && !this.validateSeoDescription(config.defaultDescription)) {
      errors.push('defaultDescription no es válida');
    }
    
    // Validar separador de título (opcional)
    if ('titleSeparator' in config) {
      if (typeof config.titleSeparator !== 'string') {
        errors.push('titleSeparator debe ser una cadena');
      }
    }
    
    // Validar meta tags por defecto (opcional)
    if ('defaultMetaTags' in config) {
      if (!Array.isArray(config.defaultMetaTags)) {
        errors.push('defaultMetaTags debe ser un array');
      } else {
        for (const tag of config.defaultMetaTags) {
          const tagValidation = this.validateMetaTag(tag);
          if (!tagValidation.isValid) {
            errors.push(...tagValidation.errors.map(err => `meta tag error: ${err}`));
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar datos estructurados
  static validateStructuredData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data || typeof data !== 'object') {
      errors.push('Los datos estructurados no son un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar @context
    if (!data['@context'] || typeof data['@context'] !== 'string') {
      errors.push('@context es requerido y debe ser una cadena');
    }
    
    // Validar @type
    if (!data['@type'] || typeof data['@type'] !== 'string') {
      errors.push('@type es requerido y debe ser una cadena');
    }
    
    // Validar JSON-LD (opcional)
    if ('jsonLd' in data) {
      try {
        JSON.stringify(data.jsonLd);
      } catch {
        errors.push('jsonLd no es serializable');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar sitemap entry
  static validateSitemapEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entry || typeof entry !== 'object') {
      errors.push('La entrada del sitemap no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar loc (URL)
    if (!entry.loc || typeof entry.loc !== 'string') {
      errors.push('loc es requerido y debe ser una cadena');
    } else {
      try {
        new URL(entry.loc);
      } catch {
        errors.push('loc debe ser una URL válida');
      }
    }
    
    // Validar lastmod (opcional)
    if ('lastmod' in entry) {
      if (!(entry.lastmod instanceof Date) || isNaN(entry.lastmod.getTime())) {
        errors.push('lastmod debe ser una fecha válida');
      }
    }
    
    // Validar changefreq (opcional)
    if ('changefreq' in entry) {
      const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      if (typeof entry.changefreq !== 'string' || !validFreqs.includes(entry.changefreq)) {
        errors.push(`changefreq debe ser uno de: ${validFreqs.join(', ')}`);
      }
    }
    
    // Validar priority (opcional)
    if ('priority' in entry) {
      if (typeof entry.priority !== 'number' || entry.priority < 0 || entry.priority > 1) {
        errors.push('priority debe ser un número entre 0 y 1');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar robots.txt entry
  static validateRobotsEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entry || typeof entry !== 'object') {
      errors.push('La entrada de robots.txt no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar user-agent
    if (!entry.userAgent || typeof entry.userAgent !== 'string') {
      errors.push('userAgent es requerido y debe ser una cadena');
    }
    
    // Validar allow/disallow
    if (!('allow' in entry) && !('disallow' in entry)) {
      errors.push('allow o disallow es requerido');
    }
    
    if ('allow' in entry && typeof entry.allow !== 'string') {
      errors.push('allow debe ser una cadena');
    }
    
    if ('disallow' in entry && typeof entry.disallow !== 'string') {
      errors.push('disallow debe ser una cadena');
    }
    
    // Validar crawl-delay (opcional)
    if ('crawlDelay' in entry) {
      if (typeof entry.crawlDelay !== 'number' || entry.crawlDelay < 0) {
        errors.push('crawlDelay debe ser un número no negativo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar canonical URL
  static validateCanonicalUrl(url: string): boolean {
    if (typeof url !== 'string') return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validar Open Graph tags
  static validateOpenGraphTags(tags: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!tags || typeof tags !== 'object') {
      errors.push('Las etiquetas Open Graph no son un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar og:title
    if ('title' in tags && !this.validateSeoTitle(tags.title)) {
      errors.push('og:title no es válido');
    }
    
    // Validar og:description
    if ('description' in tags && !this.validateSeoDescription(tags.description)) {
      errors.push('og:description no es válida');
    }
    
    // Validar og:image (opcional)
    if ('image' in tags) {
      if (typeof tags.image !== 'string') {
        errors.push('og:image debe ser una cadena');
      } else {
        try {
          new URL(tags.image);
        } catch {
          errors.push('og:image debe ser una URL válida');
        }
      }
    }
    
    // Validar og:url
    if ('url' in tags) {
      if (typeof tags.url !== 'string') {
        errors.push('og:url debe ser una cadena');
      } else {
        try {
          new URL(tags.url);
        } catch {
          errors.push('og:url debe ser una URL válida');
        }
      }
    }
    
    // Validar og:type (opcional)
    if ('type' in tags) {
      const validTypes = ['website', 'article', 'product', 'profile'];
      if (typeof tags.type !== 'string' || !validTypes.includes(tags.type)) {
        errors.push(`og:type debe ser uno de: ${validTypes.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar Twitter cards
  static validateTwitterCards(cards: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!cards || typeof cards !== 'object') {
      errors.push('Las Twitter cards no son un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar card type
    if ('card' in cards) {
      const validCards = ['summary', 'summary_large_image', 'app', 'player'];
      if (typeof cards.card !== 'string' || !validCards.includes(cards.card)) {
        errors.push(`card debe ser uno de: ${validCards.join(', ')}`);
      }
    }
    
    // Validar site
    if ('site' in cards) {
      if (typeof cards.site !== 'string') {
        errors.push('site debe ser una cadena');
      } else if (!cards.site.startsWith('@')) {
        errors.push('site debe comenzar con @');
      }
    }
    
    // Validar title
    if ('title' in cards && !this.validateSeoTitle(cards.title)) {
      errors.push('title no es válido');
    }
    
    // Validar description
    if ('description' in cards && !this.validateSeoDescription(cards.description)) {
      errors.push('description no es válida');
    }
    
    // Validar image (opcional)
    if ('image' in cards) {
      if (typeof cards.image !== 'string') {
        errors.push('image debe ser una cadena');
      } else {
        try {
          new URL(cards.image);
        } catch {
          errors.push('image debe ser una URL válida');
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}