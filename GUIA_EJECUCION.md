# 🚀 Guía de Ejecución - MicroTrust

**Guía completa para instalar y ejecutar MicroTrust en tu entorno local**

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación de Dependencias](#instalación-de-dependencias)
3. [Configuración de MetaMask](#configuración-de-metamask)
4. [Ejecución del Proyecto](#ejecución-del-proyecto)
5. [Solución de Problemas](#solución-de-problemas)
6. [Comandos Útiles](#comandos-útiles)

---

## 📦 Requisitos Previos

### Software Necesario

#### 1. Node.js (versión 18 o superior)
```bash
# Verificar si está instalado
node --version

# Debe mostrar: v18.x.x o superior
```

**Descargar:** https://nodejs.org/

#### 2. npm (incluido con Node.js)
```bash
# Verificar versión
npm --version

# Debe mostrar: 9.x.x o superior
```

#### 3. Angular CLI (versión 17)
```bash
# Instalar globalmente
npm install -g @angular/cli@17

# Verificar instalación
ng version
```

#### 4. Git (opcional pero recomendado)
```bash
# Verificar si está instalado
git --version
```

**Descargar:** https://git-scm.com/

### Extensiones del Navegador

#### MetaMask (OBLIGATORIO)
- **Chrome/Brave:** https://metamask.io/download/
- **Firefox:** https://addons.mozilla.org/firefox/addon/ether-metamask/
- **Edge:** https://microsoftedge.microsoft.com/addons/detail/metamask/

---

## 🔧 Instalación de Dependencias

### Paso 1: Clonar o Descargar el Proyecto

#### Opción A: Con Git
```bash
git clone <url-del-repositorio>
cd MicroTrust
```

#### Opción B: Descarga Manual
1. Descargar el ZIP del proyecto
2. Extraer en una carpeta
3. Abrir terminal en esa carpeta

### Paso 2: Instalar Dependencias de Node

```bash
# Instalar todas las dependencias
npm install
```

**Esto instalará:**
- Angular 17 y sus dependencias
- TypeScript
- RxJS
- SweetAlert2
- Todas las herramientas de desarrollo

**Tiempo estimado:** 2-5 minutos (según conexión)

### Paso 3: Verificar Instalación

```bash
# Ver las dependencias instaladas
npm list --depth=0
```

**Deberías ver:**
```
MicroTrust@1.0.0
├── @angular/animations@17.3.0
├── @angular/common@17.3.0
├── @angular/compiler@17.3.0
├── @angular/core@17.3.0
├── @angular/forms@17.3.0
├── @angular/platform-browser@17.3.0
├── @angular/platform-browser-dynamic@17.3.0
├── @angular/router@17.3.0
├── rxjs@7.8.0
├── sweetalert2@11.26.2
└── zone.js@0.14.0
```

---

## 🦊 Configuración de MetaMask

### Paso 1: Instalar MetaMask

1. Ve a https://metamask.io/download/
2. Haz clic en "Install MetaMask for [tu navegador]"
3. Acepta los permisos
4. Sigue el asistente de configuración:
   - Crea una nueva wallet O
   - Importa una wallet existente

⚠️ **IMPORTANTE:** Guarda tu frase de recuperación en un lugar seguro

### Paso 2: Agregar Redes de Prueba

MicroTrust funciona en **testnets** (redes de prueba). Debes configurar al menos una:

#### Red Sepolia (Recomendada)

1. Abre MetaMask
2. Haz clic en el selector de red (arriba)
3. Activa "Mostrar redes de prueba"
4. Selecciona "Sepolia"

**Configuración manual (si no aparece):**
```
Nombre de red: Sepolia
RPC URL: https://sepolia.infura.io/v3/
Chain ID: 11155111
Símbolo: ETH
Explorador: https://sepolia.etherscan.io/
```

#### Red Holešky (Opcional)

```
Nombre de red: Holešky
RPC URL: https://holesky.infura.io/v3/
Chain ID: 17000
Símbolo: ETH
Explorador: https://holesky.etherscan.io/
```

#### Red Goerli (Opcional - Deprecada)

```
Nombre de red: Goerli
RPC URL: https://goerli.infura.io/v3/
Chain ID: 5
Símbolo: ETH
Explorador: https://goerli.etherscan.io/
```

### Paso 3: Obtener ETH de Prueba (Test ETH)

Para hacer transacciones, necesitas ETH de prueba (gratis):

#### Faucets de Sepolia:
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia
- https://faucet.quicknode.com/ethereum/sepolia

#### Faucets de Holešky:
- https://holesky-faucet.pk910.de/
- https://faucet.quicknode.com/ethereum/holesky

**Pasos:**
1. Copia tu dirección de MetaMask
2. Pégala en el faucet
3. Solicita ETH
4. Espera 30-60 segundos
5. Verifica el balance en MetaMask

⚠️ **Nota:** Algunos faucets requieren tener ETH en mainnet o seguir en redes sociales

---

## ▶️ Ejecución del Proyecto

### Modo Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# O también puedes usar:
ng serve
```

**Salida esperada:**
```
✔ Browser application bundle generation complete.
Initial Chunk Files   | Names         | Raw Size
main.js              | main          |  2.5 MB
polyfills.js         | polyfills     | 90.2 kB
styles.css           | styles        | 85.4 kB

                     | Initial Total |  2.7 MB

✔ Compiled successfully.
✔ Browser application bundle generation complete.

** Angular Live Development Server is listening on localhost:4200 **

Open your browser on http://localhost:4200/
```

### Abrir la Aplicación

1. Abre tu navegador
2. Ve a: http://localhost:4200/
3. Espera a que cargue la aplicación

**Resultado:**
- Deberías ver la página de inicio de MicroTrust
- La navbar con el botón "Conectar MetaMask"

### Conectar MetaMask

1. Haz clic en "Conectar MetaMask"
2. MetaMask mostrará un popup
3. Selecciona la cuenta que deseas usar
4. Haz clic en "Siguiente" → "Conectar"

✅ **Éxito:** Tu dirección aparecerá en la navbar

---

## 🏗️ Otros Modos de Ejecución

### Modo Producción (Build)

```bash
# Compilar para producción
npm run build

# O con optimizaciones
ng build --configuration production
```

**Resultado:**
- Archivos compilados en carpeta `dist/`
- Listos para desplegar en servidor

### Modo de Pruebas

```bash
# Ejecutar tests unitarios
npm test

# O con coverage
ng test --code-coverage
```

### Linting (Verificar código)

```bash
# Verificar errores de estilo
npm run lint

# O directamente
ng lint
```

---

## 🎮 Uso de la Aplicación

### Como Usuario Regular

1. **Conectar MetaMask**
   - Botón en navbar
   - Asegúrate de estar en red de prueba (Sepolia recomendada)

2. **Solicitar Préstamo**
   - Ve a "Solicitar Préstamo"
   - Completa el formulario:
     - Nombre completo
     - Monto (máximo según red)
     - Propósito
     - Duración (días)
     - Documentos (DNI, comprobante)
   - Haz clic en "Solicitar Préstamo"
   - ✅ Solicitud creada (estado: PENDIENTE)

3. **Ver Mis Préstamos**
   - Ve a "Mis Préstamos"
   - Verás todos tus préstamos
   - Podrás descargar contratos (cuando sean aprobados)

### Como Administrador

#### Configurar tu Dirección como Admin

1. Abre: `src/app/constants/app.constants.ts`
2. Encuentra:
   ```typescript
   ADMIN_ADDRESSES: [
     '0xC7F4f019c6e41a6601166f311D51a3321eb06D7b',
     '0x231a92048f79B3316A6cF73E70cbE2b809187Ee4'
   ]
   ```
3. Agrega tu dirección:
   ```typescript
   ADMIN_ADDRESSES: [
     '0xC7F4f019c6e41a6601166f311D51a3321eb06D7b',
     '0x231a92048f79B3316A6cF73E70cbE2b809187Ee4',
     'TU_DIRECCION_AQUI' // ⬅️ Tu wallet de MetaMask
   ]
   ```
4. Guarda el archivo
5. El servidor se recargará automáticamente

#### Aprobar Préstamos

1. Conecta MetaMask con cuenta de admin
2. Ve a "Panel Administrador"
3. Verás lista de préstamos pendientes
4. Haz clic en "Aprobar" en un préstamo
5. Revisa los detalles
6. Confirma en el modal
7. **MetaMask abrirá popup** → Confirma la transacción
8. Espera 40-60 segundos
9. ✅ Verás notificación de confirmación
10. El préstamo cambia a estado APROBADO

#### Rechazar Préstamos

1. Haz clic en "Rechazar"
2. Escribe el motivo
3. Confirma
4. Préstamo queda en estado RECHAZADO

---

## 🐛 Solución de Problemas

### Error: "MetaMask no está instalado"

**Solución:**
1. Instala MetaMask desde https://metamask.io/
2. Reinicia el navegador
3. Recarga la página

### Error: "Red incorrecta"

**Síntoma:** No puedes hacer transacciones

**Solución:**
1. Abre MetaMask
2. Cambia a una red de prueba (Sepolia, Holešky, Goerli)
3. Recarga la aplicación

### Error: "Insufficient funds"

**Síntoma:** No puedes aprobar préstamos

**Solución:**
1. Ve a un faucet de la red que estás usando
2. Solicita ETH de prueba
3. Espera a recibirlo (revisa MetaMask)
4. Intenta nuevamente

### Error: "Transaction failed"

**Posibles causas:**
- Gas insuficiente
- Red congestionada
- Cancelaste en MetaMask

**Solución:**
1. Verifica tu balance en MetaMask
2. Asegúrate de tener al menos 0.01 ETH
3. Intenta nuevamente
4. Si persiste, cambia de red

### Error: "Cannot find module..."

**Síntoma:** Error al ejecutar `npm start`

**Solución:**
```bash
# Borrar node_modules
rm -rf node_modules

# Borrar package-lock.json
rm package-lock.json

# Reinstalar
npm install
```

### Error: "Port 4200 is already in use"

**Solución:**
```bash
# Ejecutar en otro puerto
ng serve --port 4300

# O matar el proceso en 4200
# Windows:
netstat -ano | findstr :4200
taskkill /PID [número] /F

# Linux/Mac:
lsof -ti:4200 | xargs kill -9
```

### La aplicación se ve rota o sin estilos

**Solución:**
```bash
# Limpiar caché de Angular
ng cache clean

# Reinstalar
npm ci

# Ejecutar nuevamente
npm start
```

### "ChunkLoadError" o errores de build

**Solución:**
```bash
# Limpiar todo
rm -rf node_modules dist .angular

# Reinstalar
npm install

# Build limpio
ng build --configuration development
```

### Transacciones muy lentas

**Verificar:**
1. ¿Estás en una red de prueba activa? (no Goerli deprecada)
2. ¿El faucet te dio suficiente ETH?
3. ¿La red no está congestionada?

**En consola del navegador (F12):**
- Busca: `⛽ Gas Price (mercado): X Gwei`
- Si es muy bajo (< 1 Gwei), la red puede estar inactiva

---

## 🔍 Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor
npm start

# Iniciar en otro puerto
ng serve --port 4300

# Abrir automáticamente el navegador
ng serve --open

# Modo verbose (más logs)
ng serve --verbose
```

### Build
```bash
# Build de desarrollo
ng build

# Build de producción
ng build --configuration production

# Build con análisis de tamaño
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/stats.json
```

### Testing
```bash
# Tests unitarios
ng test

# Tests con coverage
ng test --code-coverage

# Tests en modo headless (sin navegador)
ng test --browsers=ChromeHeadless --watch=false
```

### Limpieza
```bash
# Limpiar caché de Angular
ng cache clean

# Limpiar node_modules
rm -rf node_modules

# Limpiar todo
rm -rf node_modules dist .angular
npm install
```

### Información del Proyecto
```bash
# Ver versión de Angular
ng version

# Ver dependencias
npm list --depth=0

# Ver dependencias desactualizadas
npm outdated

# Actualizar dependencias (con cuidado)
npm update
```

---

## 📊 Monitoreo y Debugging

### Consola del Navegador (F12)

**Logs importantes:**
```javascript
🚀 Iniciando envío de X ETH...
⛽ Gas Price (mercado): X Gwei
⛽ Gas Price (con +20%): Y Gwei
✅ Transacción enviada exitosamente!
🔗 Hash de transacción: 0x...
🌐 Ver en explorador: https://...
✅ Transacción confirmada en X segundos!
```

### Verificar en Etherscan

1. Copia el hash de transacción de los logs
2. Ve a:
   - Sepolia: https://sepolia.etherscan.io/
   - Holešky: https://holesky.etherscan.io/
3. Pega el hash en el buscador
4. Ve detalles: estado, gas usado, bloques confirmados

### LocalStorage

Los préstamos se guardan en LocalStorage:

```javascript
// En consola del navegador (F12)
// Ver préstamos guardados
JSON.parse(localStorage.getItem('microtrust_loans'))

// Limpiar préstamos (si necesitas resetear)
localStorage.removeItem('microtrust_loans')
```

---

## 🌐 Despliegue en Producción

### Opción 1: Netlify

```bash
# Build de producción
npm run build

# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir=dist/microcreditos --prod
```

### Opción 2: Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Opción 3: GitHub Pages

```bash
# Instalar angular-cli-ghpages
npm install -g angular-cli-ghpages

# Build y deploy
ng build --configuration production --base-href /MicroTrust/
npx angular-cli-ghpages --dir=dist/microcreditos
```

### Opción 4: Servidor Propio

```bash
# Build
npm run build

# Archivos en dist/ listos para servir
# Copiar a tu servidor web (Apache, Nginx, etc.)
```

---

## 📝 Notas Adicionales

### Desarrollo con Hot Reload

Angular tiene hot reload automático. Cualquier cambio en:
- `.ts` (TypeScript)
- `.html` (Templates)
- `.css` (Estilos)

Se reflejará automáticamente en el navegador.

### Estructura de Carpetas Clave

```
src/app/
├── constants/          # ← Configuración (admin, redes, tasas)
├── services/          # ← Lógica de negocio
│   ├── wallet.service.ts
│   ├── loan/loan.service.ts
│   └── contract/contract.service.ts
├── pages/             # ← Páginas de la app
│   ├── admin/         # ← Panel administrador
│   ├── loan-request/  # ← Solicitar préstamo
│   └── my-loans/      # ← Ver préstamos
└── interfaces/        # ← Tipos TypeScript
```

### Variables de Entorno (Futuro)

Para producción, considera mover a `.env`:
- RPC URLs de Infura/Alchemy
- Direcciones de admin
- Chain IDs
- API keys

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa esta guía** completa
2. **Verifica logs** en consola (F12)
3. **Busca el error** en Google/Stack Overflow
4. **Abre un issue** en el repositorio con:
   - Descripción del problema
   - Logs de consola
   - Pasos para reproducir
   - Tu sistema operativo y versiones

---

## ✅ Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] npm funcionando
- [ ] Angular CLI 17 instalado
- [ ] MetaMask instalado en navegador
- [ ] Red de prueba configurada (Sepolia)
- [ ] ETH de prueba en wallet
- [ ] Proyecto descargado/clonado
- [ ] `npm install` ejecutado sin errores
- [ ] `npm start` ejecutado correctamente
- [ ] Aplicación abre en http://localhost:4200
- [ ] MetaMask conectado exitosamente
- [ ] Puedes solicitar un préstamo de prueba

Si todos los checks están ✅, ¡estás listo para usar MicroTrust!

---

**Última actualización:** Octubre 2025  
**Versión de la guía:** 1.0  
**Compatibilidad:** Angular 17, Node 18+

