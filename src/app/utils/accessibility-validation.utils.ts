export class AccessibilityValidationUtils {
  // Validar atributo ARIA
  static validateAriaAttribute(attribute: string, value: any): boolean {
    if (typeof attribute !== 'string') return false;
    
    // Verificar que el atributo comience con 'aria-'
    if (!attribute.startsWith('aria-')) return false;
    
    // Verificar que el valor sea válido para el atributo
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number';
  }

  // Validar rol ARIA
  static validateAriaRole(role: string): boolean {
    if (typeof role !== 'string') return false;
    
    const validRoles = [
      'button', 'checkbox', 'combobox', 'dialog', 'grid', 'link', 'listbox',
      'menu', 'menubar', 'menuitem', 'option', 'progressbar', 'radio',
      'scrollbar', 'slider', 'spinbutton', 'tab', 'tablist', 'tabpanel',
      'textbox', 'toolbar', 'tooltip', 'tree', 'treeitem'
    ];
    
    return validRoles.includes(role);
  }

  // Validar etiqueta de accesibilidad
  static validateAccessibilityLabel(label: string): boolean {
    return typeof label === 'string' && label.trim().length > 0;
  }

  // Validar configuración de accesibilidad
  static validateAccessibilityConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de accesibilidad no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nivel de contraste (opcional)
    if ('contrastLevel' in config) {
      const validContrastLevels = ['AA', 'AAA'];
      if (typeof config.contrastLevel !== 'string' || !validContrastLevels.includes(config.contrastLevel)) {
        errors.push(`contrastLevel debe ser uno de: ${validContrastLevels.join(', ')}`);
      }
    }
    
    // Validar tamaño de fuente mínimo (opcional)
    if ('minFontSize' in config) {
      if (typeof config.minFontSize !== 'number' || config.minFontSize <= 0) {
        errors.push('minFontSize debe ser un número positivo');
      }
    }
    
    // Validar navegación por teclado (opcional)
    if ('keyboardNavigation' in config) {
      if (typeof config.keyboardNavigation !== 'boolean') {
        errors.push('keyboardNavigation debe ser un valor booleano');
      }
    }
    
    // Validar lectura de pantalla (opcional)
    if ('screenReader' in config) {
      if (typeof config.screenReader !== 'boolean') {
        errors.push('screenReader debe ser un valor booleano');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar componente accesible
  static validateAccessibleComponent(component: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!component || typeof component !== 'object') {
      errors.push('El componente accesible no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar rol ARIA (opcional)
    if ('ariaRole' in component && !this.validateAriaRole(component.ariaRole)) {
      errors.push('ariaRole no es válido');
    }
    
    // Validar etiqueta (opcional)
    if ('label' in component && !this.validateAccessibilityLabel(component.label)) {
      errors.push('label no es válida');
    }
    
    // Validar descripción (opcional)
    if ('description' in component) {
      if (typeof component.description !== 'string') {
        errors.push('description debe ser una cadena');
      }
    }
    
    // Validar estado (opcional)
    if ('ariaState' in component) {
      if (typeof component.ariaState !== 'object') {
        errors.push('ariaState debe ser un objeto');
      } else {
        for (const [attr, value] of Object.entries(component.ariaState)) {
          if (!this.validateAriaAttribute(attr, value)) {
            errors.push(`Atributo ARIA inválido: ${attr}`);
            break;
          }
        }
      }
    }
    
    // Validar propiedades (opcional)
    if ('ariaProperties' in component) {
      if (typeof component.ariaProperties !== 'object') {
        errors.push('ariaProperties debe ser un objeto');
      } else {
        for (const [attr, value] of Object.entries(component.ariaProperties)) {
          if (!this.validateAriaAttribute(attr, value)) {
            errors.push(`Propiedad ARIA inválida: ${attr}`);
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

  // Validar navegación por teclado
  static validateKeyboardNavigation(navigation: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!navigation || typeof navigation !== 'object') {
      errors.push('La navegación por teclado no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tabIndex
    if ('tabIndex' in navigation) {
      if (typeof navigation.tabIndex !== 'number' || !Number.isInteger(navigation.tabIndex)) {
        errors.push('tabIndex debe ser un número entero');
      }
    }
    
    // Validar atajos de teclado (opcional)
    if ('shortcuts' in navigation) {
      if (!Array.isArray(navigation.shortcuts)) {
        errors.push('shortcuts debe ser un array');
      } else {
        for (const shortcut of navigation.shortcuts) {
          if (typeof shortcut !== 'object') {
            errors.push('Cada atajo debe ser un objeto');
            break;
          }
          
          if (!shortcut.key || typeof shortcut.key !== 'string') {
            errors.push('Cada atajo debe tener una tecla');
            break;
          }
          
          if (!shortcut.action || typeof shortcut.action !== 'function') {
            errors.push('Cada atajo debe tener una acción');
            break;
          }
        }
      }
    }
    
    // Validar orden de tabulación (opcional)
    if ('tabOrder' in navigation) {
      if (!Array.isArray(navigation.tabOrder)) {
        errors.push('tabOrder debe ser un array');
      } else {
        for (const item of navigation.tabOrder) {
          if (typeof item !== 'string') {
            errors.push('Cada elemento en tabOrder debe ser una cadena');
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

  // Validar contraste de color
  static validateColorContrast(contrast: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!contrast || typeof contrast !== 'object') {
      errors.push('El contraste de color no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar color de texto
    if (!contrast.textColor || typeof contrast.textColor !== 'string') {
      errors.push('textColor es requerido y debe ser una cadena');
    }
    
    // Validar color de fondo
    if (!contrast.backgroundColor || typeof contrast.backgroundColor !== 'string') {
      errors.push('backgroundColor es requerido y debe ser una cadena');
    }
    
    // Validar ratio (opcional)
    if ('ratio' in contrast) {
      if (typeof contrast.ratio !== 'number' || contrast.ratio <= 0) {
        errors.push('ratio debe ser un número positivo');
      }
    }
    
    // Validar nivel (opcional)
    if ('level' in contrast) {
      const validLevels = ['AA', 'AAA'];
      if (typeof contrast.level !== 'string' || !validLevels.includes(contrast.level)) {
        errors.push(`level debe ser uno de: ${validLevels.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar estructura semántica
  static validateSemanticStructure(structure: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!structure || typeof structure !== 'object') {
      errors.push('La estructura semántica no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar encabezados
    if ('headings' in structure) {
      if (!Array.isArray(structure.headings)) {
        errors.push('headings debe ser un array');
      } else {
        for (const heading of structure.headings) {
          if (typeof heading !== 'object') {
            errors.push('Cada encabezado debe ser un objeto');
            break;
          }
          
          if (!('level' in heading) || typeof heading.level !== 'number' || heading.level < 1 || heading.level > 6) {
            errors.push('Cada encabezado debe tener un nivel entre 1 y 6');
            break;
          }
          
          if (!('text' in heading) || typeof heading.text !== 'string') {
            errors.push('Cada encabezado debe tener texto');
            break;
          }
        }
      }
    }
    
    // Validar landmarks (opcional)
    if ('landmarks' in structure) {
      if (!Array.isArray(structure.landmarks)) {
        errors.push('landmarks debe ser un array');
      } else {
        const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
        for (const landmark of structure.landmarks) {
          if (typeof landmark !== 'object') {
            errors.push('Cada landmark debe ser un objeto');
            break;
          }
          
          if (!landmark.role || typeof landmark.role !== 'string' || !validLandmarks.includes(landmark.role)) {
            errors.push(`Rol de landmark inválido: ${landmark.role}`);
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

  // Validar alternativas de texto
  static validateTextAlternatives(alternatives: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!alternatives || typeof alternatives !== 'object') {
      errors.push('Las alternativas de texto no son un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar imágenes
    if ('images' in alternatives) {
      if (!Array.isArray(alternatives.images)) {
        errors.push('images debe ser un array');
      } else {
        for (const image of alternatives.images) {
          if (typeof image !== 'object') {
            errors.push('Cada imagen debe ser un objeto');
            break;
          }
          
          if (!image.src || typeof image.src !== 'string') {
            errors.push('Cada imagen debe tener una fuente');
            break;
          }
          
          if (!image.alt || typeof image.alt !== 'string') {
            errors.push('Cada imagen debe tener texto alternativo');
            break;
          }
        }
      }
    }
    
    // Validar formularios
    if ('forms' in alternatives) {
      if (!Array.isArray(alternatives.forms)) {
        errors.push('forms debe ser un array');
      } else {
        for (const form of alternatives.forms) {
          if (typeof form !== 'object') {
            errors.push('Cada formulario debe ser un objeto');
            break;
          }
          
          if (!form.id || typeof form.id !== 'string') {
            errors.push('Cada formulario debe tener un ID');
            break;
          }
          
          if (!form.label || typeof form.label !== 'string') {
            errors.push('Cada formulario debe tener una etiqueta');
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
}