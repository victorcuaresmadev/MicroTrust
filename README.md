# 🏦 MicroTrust

**Plataforma descentralizada de microcréditos basada en blockchain Ethereum**

---

## 📋 Descripción del Proyecto

MicroTrust es una plataforma innovadora que democratiza el acceso a servicios financieros mediante tecnología blockchain. Permite a personas sin acceso a servicios bancarios tradicionales obtener préstamos de forma rápida, segura y transparente.

### 🎯 Problema que Resuelve

- **Exclusión financiera**: Millones de personas no tienen acceso a créditos tradicionales
- **Procesos lentos**: Los bancos tardan días o semanas en aprobar préstamos
- **Falta de transparencia**: Términos y condiciones complejos y ocultos
- **Altas barreras de entrada**: Requisitos excesivos de documentación

### ✨ Solución MicroTrust

- ✅ Préstamos 100% digitales mediante wallet Ethereum (MetaMask)
- ✅ Aprobación y desembolso en **menos de 1 minuto**
- ✅ Transparencia total en blockchain
- ✅ Sin intermediarios bancarios
- ✅ Tasas de interés justas y adaptativas

---

## 🚀 Características Principales

### Para Usuarios (Prestatarios)

- 📱 **Solicitud Instantánea**: Completa el formulario y solicita en minutos
- 💳 **Conexión con MetaMask**: Tu wallet es tu identidad
- 📊 **Seguimiento en Tiempo Real**: Ve el estado de tu préstamo siempre
- 📄 **Contratos Digitales**: Descarga tu contrato con código QR de verificación
- 🔔 **Notificaciones**: Alertas instantáneas de cambios de estado
- 🌐 **Múltiples Redes**: Soporta Goerli, Sepolia, Holešky, Hoodi testnet

### Para Administradores

- ✅ **Aprobación Rápida**: Revisa y aprueba en segundos
- 💰 **Desembolso Automático**: Envío de ETH con un clic
- 📈 **Panel de Control**: Visualiza todas las solicitudes
- 🔍 **Verificación Blockchain**: Links directos a exploradores
- 📊 **Estadísticas**: Monitoreo de préstamos activos
- 🎉 **Notificaciones en Tiempo Real**: Alertas de confirmación de transacciones

---

## 🏗️ Arquitectura del Sistema

### Tecnologías Utilizadas

#### Frontend
- **Angular 17**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **SweetAlert2**: Notificaciones elegantes

#### Blockchain
- **Ethereum**: Red blockchain
- **MetaMask**: Wallet y proveedor Web3
- **Transacciones P2P**: Envío directo de ETH
- **Redes Testnet**: Goerli, Sepolia, Holešky, Hoodi

#### Almacenamiento
- **LocalStorage**: Persistencia de datos en navegador
- **JSON**: Formato de datos estructurados

### Estructura del Proyecto

```
MicroTrust/
├── src/
│   ├── app/
│   │   ├── constants/          # Constantes de la aplicación
│   │   │   └── app.constants.ts
│   │   ├── interfaces/         # Interfaces TypeScript
│   │   │   ├── loan.interface.ts
│   │   │   └── contract.interface.ts
│   │   ├── services/           # Servicios de la aplicación
│   │   │   ├── wallet.service.ts
│   │   │   ├── loan/
│   │   │   │   └── loan.service.ts
│   │   │   ├── contract/
│   │   │   │   └── contract.service.ts
│   │   │   └── blockchain-explorer.service.ts
│   │   ├── pages/              # Páginas de la aplicación
│   │   │   ├── home/           # Página de inicio
│   │   │   ├── login/          # Conexión MetaMask
│   │   │   ├── loan-request/   # Solicitud de préstamo
│   │   │   ├── my-loans/       # Mis préstamos (usuario)
│   │   │   ├── admin/          # Panel administrador
│   │   │   ├── descripcion/    # Sobre el proyecto
│   │   │   ├── objetivos/      # Objetivos
│   │   │   ├── beneficios/     # Beneficios
│   │   │   ├── caracteristicas/# Características
│   │   │   ├── equipo/         # Equipo de desarrollo
│   │   │   └── soporte/        # Soporte y contacto
│   │   ├── shared/             # Componentes compartidos
│   │   │   ├── navbar/         # Barra de navegación
│   │   │   └── user-profile/   # Perfil de usuario
│   │   └── guards/             # Protección de rutas
│   ├── environments/           # Configuración de entornos
│   ├── styles.css             # Estilos globales
│   └── index.html             # HTML principal
├── angular.json               # Configuración Angular
├── package.json              # Dependencias npm
├── tsconfig.json             # Configuración TypeScript
├── README.md                 # Este archivo
└── GUIA_EJECUCION.md         # Guía de instalación
```

---

## 💡 Funcionalidades Detalladas

### 1. Sistema de Autenticación

#### Conexión con MetaMask
```typescript
// El usuario conecta su wallet
conectar() → MetaMask → Obtener dirección → Verificar permisos
```

**Características:**
- Detección automática de MetaMask instalado
- Manejo de errores si no está instalado
- Verificación de red (testnet requerida)
- Guardado de sesión automático

#### Roles de Usuario
- **Usuario Regular**: Puede solicitar préstamos
- **Administrador**: Puede aprobar/rechazar préstamos (direcciones configuradas)

### 2. Solicitud de Préstamos

#### Proceso
1. Usuario completa formulario con:
   - Nombre completo
   - Monto solicitado (límite según red)
   - Propósito del préstamo
   - Duración del préstamo
   - Red blockchain
   - Documento de identidad (DNI)
   - Comprobante de domicilio

2. Sistema calcula:
   - Tasa de interés según propósito
   - Monto total a pagar
   - Fecha estimada de pago

3. Préstamo queda en estado **PENDIENTE**

#### Tipos de Préstamo y Tasas

| Propósito | Tasa Base | Tasa Adicional | Total |
|-----------|-----------|----------------|-------|
| Estudiante | 5% | +7% | **12%** |
| Negocio | 10% | +7% | **17%** |
| Salud | 8% | +7% | **15%** |
| Eventos | 13% | +7% | **20%** |
| Otro | 18% | +7% | **25%** |

#### Límites por Red

| Red | Límite Máximo |
|-----|---------------|
| Goerli | 3 ETH |
| Holešky | 10 ETH |
| Sepolia | 5 ETH |
| Hoodi | 8 ETH |

### 3. Aprobación de Préstamos (Admin)

#### Flujo Optimizado
```
Admin revisa préstamo
     ↓
Verifica MetaMask (2-3s)
     ↓
Obtiene gas price dinámico (1s)
     ↓
Usuario aprueba en MetaMask (5s)
     ↓
Transacción enviada a blockchain (2s)
     ↓
Verificación cada 5 segundos
     ↓
Confirmación en 15-60 segundos ✅
     ↓
Notificación automática
```

#### Características de Desembolso
- 🚀 **Gas Price Dinámico**: Se ajusta al mercado + 20% de prioridad
- ⚡ **Verificación Rápida**: Cada 5 segundos (no 30s)
- 🎯 **Timeout Inteligente**: 60 segundos con alerta temprana
- 🔔 **Notificaciones**: Popup automático al confirmar
- 📊 **Trazabilidad**: Link directo a Etherscan

### 4. Estados del Préstamo

```mermaid
PENDING (Pendiente)
    ↓
PAYMENT_PENDING (Pago en proceso)
    ↓
DISBURSED (Desembolsado - esperando confirmación)
    ↓
APPROVED (Aprobado - confirmado en blockchain)
    ↓
PAID (Pagado por el usuario)

O bien:

PENDING → REJECTED (Rechazado)
```

### 5. Sistema de Contratos

#### Generación de Contrato
Cuando un préstamo es aprobado, se genera automáticamente:

**Contenido del Contrato:**
- ID único del préstamo
- Información del prestatario
- Detalles del préstamo (monto, interés, plazo)
- Propósito
- Red blockchain utilizada
- Código QR con datos del contrato
- Firma digital

**Formatos Disponibles:**
- 🖨️ Imprimir directamente
- 💾 Descargar como HTML
- 👁️ Ver en nueva pestaña
- 📧 Enviar por email (desde navegador)

#### Código QR
Cada contrato incluye un QR con:
- ID del contrato
- Nombre del prestatario
- Dirección wallet
- Monto y red
- Empresa (MicroTrust)
- RUC de la empresa
- Código de verificación único

### 6. Seguimiento de Transacciones

#### Integración con Etherscan
- Ver transacciones en tiempo real
- Verificar confirmaciones
- Explorar historial completo
- Links directos por red:
  - Goerli: `goerli.etherscan.io`
  - Sepolia: `sepolia.etherscan.io`
  - Holešky: `holesky.etherscan.io`
  - Hoodi: `hoodi.etherscan.io`

#### Eventos Registrados
Cada préstamo guarda un log de eventos:
- Fecha de creación
- Aprobación por admin (dirección)
- Hash de transacción de desembolso
- Tiempo de confirmación
- Estado en blockchain
- Pago del usuario (si aplica)

---

## ⚡ Optimizaciones de Rendimiento

### Problema Original
❌ Las transacciones tardaban **1.5 - 10+ minutos**
❌ No había feedback al usuario
❌ Gas price fijo causaba estancamientos

### Solución Implementada

#### 1. Gas Price Dinámico
```typescript
// Obtiene precio actual del mercado
const gasPrice = await ethereum.request({ method: 'eth_gasPrice' });

// Agrega 20% para priorizar
const optimized = gasPrice * 1.20;
```

**Resultado:** Transacciones priorizadas, casi sin estancamientos

#### 2. Polling Optimizado
```typescript
// Verifica cada 5 segundos (antes 30s)
setInterval(() => checkTransaction(), 5000);

// Timeout de 60 segundos (antes 10 minutos)
if (attempts > 12) alertUser();
```

**Resultado:** Detección 6x más rápida

#### 3. Sistema de Notificaciones
```typescript
// Eventos personalizados
window.dispatchEvent(new CustomEvent('transaction-confirmed', {
  detail: { loan, txHash, time }
}));
```

**Resultado:** Usuario informado instantáneamente

### Tiempos Actuales

| Escenario | Tiempo | Estado |
|-----------|--------|--------|
| **Óptimo** | 40 segundos | ✅ Excelente |
| **Normal** | 55 segundos | ✅ Muy bueno |
| **Límite** | 60 segundos | ✅ Objetivo cumplido |

---

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación Blockchain**
   - Solo wallets conectadas pueden operar
   - Verificación de firma digital
   - Sin contraseñas tradicionales

2. **Control de Acceso**
   - Roles diferenciados (usuario/admin)
   - Direcciones admin pre-configuradas
   - Validación en cada operación

3. **Validación de Datos**
   - Verificación de montos
   - Límites por red
   - Prevención de desbordamiento

4. **Trazabilidad**
   - Todas las transacciones en blockchain
   - Logs de eventos
   - Hashes verificables en Etherscan

5. **Manejo de Errores**
   - Transacciones con try-catch
   - Rollback en caso de fallo
   - Mensajes descriptivos al usuario

### Direcciones Administradoras

Configuradas en `src/app/constants/app.constants.ts`:
```typescript
ADMIN_ADDRESSES: [
  '0xC7F4f019c6e41a6601166f311D51a3321eb06D7b', // Victor Cuaresma
  '0x231a92048f79B3316A6cF73E70cbE2b809187Ee4'  // Ronaldinho Ccencho
]
```

---

## 📊 Datos y Configuración

### Constantes del Sistema

```typescript
COMPANY_NAME: 'MicroTrust'
COMPANY_RUC: '20537570220'

NETWORKS:
  - Goerli (límite: 3 ETH)
  - Holešky (límite: 10 ETH)
  - Sepolia (límite: 5 ETH)

PURPOSE_TYPES:
  - Estudiante (12% interés)
  - Negocio (17% interés)
  - Salud (15% interés)
  - Eventos (20% interés)
  - Otro (25% interés)
```

### Almacenamiento

**LocalStorage Keys:**
- `microtrust_loans`: Array de préstamos
- Persistencia automática
- Sincronización en tiempo real

**Formato de Préstamo:**
```typescript
{
  id: string,
  borrowerName: string,
  borrowerAddress: string,
  amount: number,
  interestRate: number,
  purpose: string,
  purposeType: string,
  network: string,
  dni: string,
  status: string,
  createdAt: Date,
  approvedAt?: Date,
  approvedBy?: string,
  events?: string,
  contractUrl?: string
}
```

---

## 🎨 Interfaz de Usuario

### Diseño Responsivo
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px+)
- ✅ Tablet (768px+)
- ✅ Mobile (375px+)

### Temas
- 🌙 **Modo Oscuro**: Diseño principal
- 🎮 **Estilo Gamer**: Colores neón y efectos
- 🎨 **Paleta de Colores**:
  - Primary: `#00d4ff` (cyan)
  - Success: `#10b981` (green)
  - Warning: `#f59e0b` (orange)
  - Danger: `#ef4444` (red)
  - Background: `#0a0e27` (dark blue)

### Componentes Clave
- **Navbar**: Navegación + perfil de usuario
- **Cards**: Información de préstamos
- **Modals**: Confirmaciones y detalles
- **Forms**: Validación en tiempo real
- **Notifications**: SweetAlert2 personalizado

---

## 🧪 Testing

### Pruebas Manuales Recomendadas

#### Como Usuario
1. ✅ Conectar MetaMask
2. ✅ Solicitar préstamo
3. ✅ Ver mis préstamos
4. ✅ Descargar contrato

#### Como Administrador
1. ✅ Ver préstamos pendientes
2. ✅ Aprobar préstamo
3. ✅ Verificar notificaciones
4. ✅ Rechazar préstamo
5. ✅ Generar contrato

#### Casos Edge
- ❌ MetaMask no instalado
- ❌ Red incorrecta
- ❌ Sin balance suficiente
- ❌ Usuario cancela en MetaMask
- ❌ Transacción demorada

---

## 🚧 Limitaciones Actuales

### Arquitectura
- ⚠️ **No usa Smart Contracts desplegados**: Las transacciones son P2P directas
- ⚠️ **Datos en LocalStorage**: No hay backend centralizado
- ⚠️ **Solo testnets**: No está en producción en mainnet

### Funcional
- ⚠️ **Sin automatización de pagos**: Usuario debe pagar manualmente
- ⚠️ **Sin garantías on-chain**: No hay colateral en contratos inteligentes
- ⚠️ **Sin oráculo de reputación**: No verifica historial crediticio

---

## 🔮 Mejoras Futuras Sugeridas

### Fase 1: Smart Contracts
- [ ] Implementar contratos Solidity
- [ ] Sistema de garantías (colateral)
- [ ] Pagos automáticos programados
- [ ] Sistema de multas por retraso

### Fase 2: Backend
- [ ] Base de datos centralizada
- [ ] API REST
- [ ] Autenticación JWT
- [ ] Sincronización multi-dispositivo

### Fase 3: Funcionalidades
- [ ] Sistema de reputación
- [ ] Préstamos entre usuarios (P2P lending)
- [ ] Marketplace de préstamos
- [ ] Integración con DeFi protocols

### Fase 4: Producción
- [ ] Migrar a Ethereum Mainnet
- [ ] Integración con stablecoins (USDC, DAI)
- [ ] KYC/AML compliance
- [ ] Auditoría de seguridad

---

## 👥 Equipo de Desarrollo

### Victor Cuaresma
- **Rol**: Líder de Proyecto y Desarrollador Principal
- **Especialidad**: Blockchain y Finanzas Descentralizadas
- **Wallet**: `0xC7F4f019c6e41a6601166f311D51a3321eb06D7b`

### Ronaldinho Ccencho Ramos
- **Rol**: Desarrollador Blockchain
- **Especialidad**: Tecnología Blockchain y Soluciones Fintech
- **Wallet**: `0x231a92048f79B3316A6cF73E70cbE2b809187Ee4`

---

## 📞 Soporte y Contacto

### Reportar Problemas
- Abre un issue en el repositorio
- Describe el problema en detalle
- Incluye logs de consola (F12)
- Menciona tu red y versión de MetaMask

### Contribuir
- Fork el repositorio
- Crea una branch para tu feature
- Haz commit con mensajes descriptivos
- Abre un Pull Request

---

## 📄 Licencia

**MIT License**

Copyright (c) 2025-2026 Víctor Cuaresma

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia de este software y archivos de documentación asociados, para utilizar el Software sin restricciones, incluyendo sin limitación los derechos de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o vender copias del Software.

---

## 🙏 Agradecimientos

- **MetaMask**: Por la integración con Ethereum
- **Angular Team**: Por el excelente framework
- **Ethereum Foundation**: Por la infraestructura blockchain
- **Etherscan**: Por el explorador de blockchain
- **SweetAlert2**: Por las notificaciones elegantes

---

## 📚 Recursos Útiles

### Documentación
- [Angular Documentation](https://angular.io/docs)
- [MetaMask Docs](https://docs.metamask.io/)
- [Ethereum.org](https://ethereum.org/en/developers/)
- [Web3 Guides](https://web3js.readthedocs.io/)

### Herramientas
- [Remix IDE](https://remix.ethereum.org/) - Para escribir smart contracts
- [Hardhat](https://hardhat.org/) - Framework de desarrollo
- [Etherscan](https://etherscan.io/) - Explorador blockchain
- [Faucets](https://faucetlink.to/) - Obtener ETH de prueba

---

## 🎓 Notas Finales

MicroTrust es un proyecto educativo y de demostración que muestra cómo blockchain puede democratizar el acceso a servicios financieros. El código está optimizado para rendimiento, seguridad y experiencia de usuario.

**Para empezar a usar el proyecto**, consulta la [Guía de Ejecución](GUIA_EJECUCION.md).

---

**Última actualización:** Octubre 2025  
**Versión:** 2.0 (Optimizada)  
**Estado:** Activo en Testnets
