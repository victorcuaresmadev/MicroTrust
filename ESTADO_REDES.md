# 🌐 Estado de las Redes Blockchain - MicroTrust

## 📊 Resumen de Disponibilidad

| Red | Estado | Límite | Velocidad | Disponibilidad |
|-----|--------|--------|-----------|----------------|
| **🟢 Hoodi** | ✅ Operativa | 8 ETH | ⚡ Rápida (15-30s) | ✅ Totalmente disponible |
| **🟢 Sepolia** | ✅ Operativa | 5 ETH | ⚡ Rápida (15-30s) | ✅ Totalmente disponible |
| **🟡 Holesky** | ⚠️ Lenta | 10 ETH | ⏱️ Lenta (5-10 min) | ⚠️ Disponible con advertencias |
| **🔴 Goerli** | ❌ No Disponible | 3 ETH | - | ❌ Sin saldo |
| **🔴 Ephemery** | ❌ No Disponible | 3 ETH | - | ❌ Sin saldo |

---

## 🟢 Redes DISPONIBLES

### 1. Hoodi ⚡ (RECOMENDADA)

**Estado:** ✅ Totalmente operativa

**Características:**
- 💰 **Límite:** 8 ETH por préstamo
- ⚡ **Velocidad:** 15-30 segundos
- 🔒 **Estabilidad:** Alta
- 🌐 **Chain ID:** 560048 (0x88c50)
- 🔗 **RPC:** https://0xrpc.io/hoodi
- 📊 **Explorador:** https://hoodi.etherscan.io

**Ventajas:**
- ✅ Red más rápida del sistema
- ✅ Alta estabilidad
- ✅ Mayor límite después de Holesky
- ✅ Soporte a largo plazo

**Recomendada para:**
- Préstamos urgentes
- Préstamos de alto monto (hasta 8 ETH)
- Usuarios nuevos

---

### 2. Sepolia ⚡

**Estado:** ✅ Totalmente operativa

**Características:**
- 💰 **Límite:** 5 ETH por préstamo
- ⚡ **Velocidad:** 15-30 segundos
- 🔒 **Estabilidad:** Alta
- 🌐 **Chain ID:** 11155111 (0xaa36a7)
- 🔗 **RPC:** https://ethereum-sepolia-rpc.publicnode.com
- 📊 **Explorador:** https://sepolia.etherscan.io

**Ventajas:**
- ✅ Red muy estable
- ✅ Rápida confirmación de transacciones
- ✅ Soporte a largo plazo de Ethereum Foundation
- ✅ Amplia documentación

**Recomendada para:**
- Préstamos de monto medio (hasta 5 ETH)
- Usuarios que prefieren redes oficiales de Ethereum
- Testing y desarrollo

---

### 3. Holesky ⚠️ (CON ADVERTENCIAS)

**Estado:** ⚠️ Operativa pero LENTA

**Características:**
- 💰 **Límite:** 10 ETH por préstamo (el más alto)
- ⏱️ **Velocidad:** 5-10 minutos (LENTA)
- 🔒 **Estabilidad:** Media-Baja
- 🌐 **Chain ID:** 17000 (0x4268)
- 🔗 **RPC:** https://holesky.drpc.org
- 📊 **Explorador:** https://holesky.etherscan.io
- 📅 **Descontinuación:** 31 de octubre de 2025

**Advertencias:**
- ⚠️ **Transacciones lentas:** 5-10 minutos de espera
- ⚠️ **Red será descontinuada** el 31 de octubre de 2025
- ⚠️ **Sobrecarga de red** debido a su próximo cierre
- ⚠️ Puede haber timeouts en transacciones

**Ventajas:**
- ✅ Mayor límite de préstamo (10 ETH)
- ✅ Aún funcional

**Desventajas:**
- ❌ Muy lenta (5-10 minutos)
- ❌ Será descontinuada pronto
- ❌ Experiencia de usuario pobre

**Recomendada SOLO para:**
- Préstamos de alto monto (8+ ETH) si no tienes prisa
- Testing de paciencia de usuarios 😅
- Casos donde otras redes no estén disponibles

**NO recomendada para:**
- ❌ Préstamos urgentes
- ❌ Usuarios nuevos
- ❌ Uso en producción

---

## 🔴 Redes NO DISPONIBLES

### 4. Goerli ❌

**Estado:** ❌ NO DISPONIBLE

**Motivo:**
- 💰 **Sin saldo en la wallet administrativa**
- 🔧 Estamos trabajando en recargar saldo

**Características (cuando esté disponible):**
- 💰 **Límite:** 3 ETH por préstamo
- 🌐 **Chain ID:** 5 (0x5)
- 🔗 **RPC:** https://goerli.infura.io/v3/
- 📊 **Explorador:** https://goerli.etherscan.io/
- 📅 **Estado de Ethereum:** Descontinuada en 2024

**Advertencias del sistema:**
```
🚫 La red Goerli no está disponible temporalmente
💰 Estamos trabajando en tener saldo en esta red
⚠️ NO SE PUEDE SOLICITAR PRÉSTAMOS en Goerli
```

**Cuando un usuario intenta seleccionar Goerli:**
1. Se muestra popup de error
2. Se le ofrecen alternativas (Hoodi o Sepolia)
3. Se cambia automáticamente la red

**Cuando admin intenta aprobar préstamo en Goerli:**
1. Se muestra advertencia en el popup de confirmación
2. Se bloquea el botón de aprobación
3. Se sugiere al admin pedir al cliente cambiar de red

---

### 5. Ephemery ❌

**Estado:** ❌ NO DISPONIBLE

**Motivo:**
- 💰 **Sin saldo en la wallet administrativa**
- 🔧 Estamos trabajando en recargar saldo

**Características (cuando esté disponible):**
- 💰 **Límite:** 3 ETH por préstamo
- 🌐 **Chain ID:** Variable (red temporal)
- 📝 **Nota:** Red de prueba temporal que se reinicia periódicamente

**Advertencias del sistema:**
```
🚫 La red Ephemery no está disponible temporalmente
💰 Estamos trabajando en tener saldo en esta red
⚠️ NO SE PUEDE SOLICITAR PRÉSTAMOS en Ephemery
```

**Cuando un usuario intenta seleccionar Ephemery:**
1. Se muestra popup de error
2. Se le ofrecen alternativas (Hoodi o Sepolia)
3. Se cambia automáticamente la red

**Cuando admin intenta aprobar préstamo en Ephemery:**
1. Se muestra advertencia en el popup de confirmación
2. Se bloquea el botón de aprobación
3. Se sugiere al admin pedir al cliente cambiar de red

---

## 🎯 Recomendaciones por Caso de Uso

### Para Préstamos Rápidos (< 1 ETH)
**Recomendación:** 🟢 **Hoodi** o 🟢 **Sepolia**
- Ambas son rápidas (15-30s)
- Alta estabilidad
- Excelente experiencia de usuario

### Para Préstamos Medianos (1-5 ETH)
**Recomendación:** 🟢 **Hoodi** o 🟢 **Sepolia**
- Hoodi soporta hasta 8 ETH
- Sepolia soporta hasta 5 ETH
- Velocidad similar

### Para Préstamos Altos (5-8 ETH)
**Recomendación:** 🟢 **Hoodi**
- Única red rápida con límite de 8 ETH
- Evitar Holesky por su lentitud

### Para Préstamos Muy Altos (8-10 ETH)
**Recomendación:** 🟡 **Holesky** (con paciencia)
- Única opción disponible para montos > 8 ETH
- ⚠️ Esperar 5-10 minutos por transacción
- ⚠️ Será descontinuada el 31/10/2025

### Para Testing y Desarrollo
**Recomendación:** 🟢 **Sepolia**
- Red oficial de Ethereum
- Soporte a largo plazo
- Amplia documentación

---

## 🔧 Implementación Técnica

### Sistema de Advertencias

#### 1. Cliente (Solicitud de Préstamo)

**Archivo:** `src/app/pages/loan-request/loan-request.component.ts`

```typescript
onNetworkChange() {
  // Bloqueo total: Goerli y Ephemery
  if (this.loanForm.network === 'goerli' || this.loanForm.network === 'ephemery') {
    // Muestra popup de error
    // No permite continuar
    // Cambia automáticamente a Hoodi o Sepolia
    return;
  }
  
  // Advertencia: Holesky
  if (this.loanForm.network === 'holesky') {
    // Muestra advertencia pero permite continuar
  }
}
```

#### 2. Admin (Aprobación de Préstamo)

**Archivo:** `src/app/pages/admin/admin.component.ts`

```typescript
preConfirm: async () => {
  // Bloquear aprobación si es Goerli o Ephemery
  if (loan.network === 'goerli' || loan.network === 'ephemery') {
    Swal.showValidationMessage('No se puede aprobar: Sin saldo');
    return false;
  }
  
  // Permite aprobar Holesky (con advertencia previa)
}
```

---

## 📊 Estadísticas y Métricas

### Tiempos de Confirmación Promedio

```
Hoodi:     ███░░░░░░░ 15-30s  ⚡
Sepolia:   ███░░░░░░░ 15-30s  ⚡
Holesky:   ████████░░ 5-10min ⏱️
Goerli:    ██████████ N/A     ❌
Ephemery:  ██████████ N/A     ❌
```

### Límites de Préstamo

```
Holesky:   ██████████ 10 ETH (Lento)
Hoodi:     ████████░░  8 ETH (Rápido) ⭐
Sepolia:   █████░░░░░  5 ETH (Rápido)
Goerli:    ███░░░░░░░  3 ETH (No disponible)
Ephemery:  ███░░░░░░░  3 ETH (No disponible)
```

### Estabilidad

```
Sepolia:   ██████████ 100% ⭐
Hoodi:     ██████████ 100% ⭐
Holesky:   █████░░░░░  50% ⚠️
Goerli:    ░░░░░░░░░░   0% ❌
Ephemery:  ░░░░░░░░░░   0% ❌
```

---

## 📅 Cronología

| Fecha | Evento |
|-------|--------|
| **30/10/2025** | Implementación de sistema de advertencias |
| **31/10/2025** | 🚨 Descontinuación de Holesky |
| **01/11/2025** | Holesky dejará de funcionar |
| **TBD** | Recarga de saldo en Goerli |
| **TBD** | Recarga de saldo en Ephemery |

---

## 🎨 Flujo Visual de Selección de Red

```
Usuario selecciona red
         ↓
    ┌────┴────┐
    ↓         ↓
 Disponible  No Disponible
    ↓         ↓
┌───┴───┐  Goerli/Ephemery
↓       ↓         ↓
Hoodi  Sepolia  🚫 Popup Error
  ✅      ✅         ↓
              Auto-cambio a Hoodi
              
         Holesky
            ↓
      ⚠️ Advertencia
            ↓
      Puede continuar
         (lento)
```

---

## 🔐 Seguridad y Validaciones

### Validaciones en Cliente
- ✅ Verifica red antes de enviar formulario
- ✅ Bloquea Goerli y Ephemery automáticamente
- ✅ Advierte sobre Holesky
- ✅ Valida límite de préstamo por red

### Validaciones en Admin
- ✅ Verifica red antes de aprobar
- ✅ Bloquea aprobación en Goerli/Ephemery
- ✅ Muestra advertencia para Holesky
- ✅ Valida saldo disponible

### Validaciones en Backend/Smart Contract
- ✅ Verifica conexión de MetaMask
- ✅ Valida chain ID antes de transacción
- ✅ Verifica saldo suficiente
- ✅ Manejo de errores de red

---

## 📞 Soporte y Troubleshooting

### Problema: "No puedo seleccionar Goerli"
**Solución:** Goerli no está disponible por falta de saldo. Usa Hoodi o Sepolia.

### Problema: "No puedo seleccionar Ephemery"
**Solución:** Ephemery no está disponible por falta de saldo. Usa Hoodi o Sepolia.

### Problema: "Holesky es muy lenta"
**Solución:** Usa Hoodi o Sepolia. Holesky tiene demoras de 5-10 minutos.

### Problema: "Quiero pedir más de 8 ETH"
**Solución:** Debes usar Holesky (10 ETH máx) y tener paciencia con la transacción.

### Problema: "El admin no puede aprobar mi préstamo en Goerli"
**Solución:** Cambia tu solicitud a Hoodi o Sepolia.

---

## 🚀 Próximas Mejoras

### Corto Plazo (1-2 semanas)
- [ ] Recargar saldo en Goerli
- [ ] Recargar saldo en Ephemery
- [ ] Migrar préstamos activos de Holesky

### Medio Plazo (1 mes)
- [ ] Eliminar Holesky del sistema (post 31/10)
- [ ] Aumentar límite de Hoodi a 12 ETH
- [ ] Implementar notificaciones de estado de redes

### Largo Plazo (3+ meses)
- [ ] Agregar más redes L2 (Optimism, Arbitrum)
- [ ] Implementar selección automática de red óptima
- [ ] Dashboard de métricas de redes

---

**Última actualización:** 30 de octubre de 2025  
**Versión:** 2.0.0  
**Responsable:** Sistema MicroTrust

