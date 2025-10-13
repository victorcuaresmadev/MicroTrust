# MicroTrust

Plataforma de microcréditos descentralizados basada en blockchain.

## Descripción

MicroTrust es una plataforma innovadora que permite a personas sin acceso a servicios financieros tradicionales obtener préstamos de forma rápida, segura y transparente utilizando tecnología blockchain. La plataforma utiliza contratos inteligentes para automatizar el proceso de préstamo y garantizar la transparencia en todas las transacciones.

## Características Principales

- **Solicitud de préstamos 100% digital** mediante wallet de Ethereum
- **Tasas de interés adaptativas** según el propósito del préstamo
- **Límites de préstamo por nivel de experiencia** del usuario
- **Generación automática de contratos** con código QR único
- **Panel de administración** para aprobación de préstamos
- **Soporte para múltiples redes** de prueba (Goerli, Sepolia, etc.)

## Tecnologías Utilizadas

- Angular 17
- TypeScript
- Blockchain (Ethereum)
- MetaMask Integration
- Smart Contracts

## Instalación

```bash
npm install
```

## Ejecución

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

## Estructura del Proyecto

- `src/app/shared/` - Componentes compartidos (navbar, etc.)
- `src/app/pages/` - Páginas de la aplicación
- `src/app/services/` - Servicios (wallet, préstamos, contratos)
- `src/app/pages/home/` - Página de inicio
- `src/app/pages/descripcion/` - Descripción del proyecto
- `src/app/pages/objetivos/` - Objetivos de la plataforma
- `src/app/pages/beneficios/` - Beneficios para usuarios
- `src/app/pages/caracteristicas/` - Características técnicas
- `src/app/pages/equipo/` - Información del equipo
- `src/app/pages/soporte/` - Página de soporte y contacto
- `src/app/pages/loan-request/` - Solicitud de préstamos
- `src/app/pages/my-loans/` - Vista de préstamos del usuario
- `src/app/pages/admin/` - Panel de administración

## Funcionalidades

### Para Usuarios
- Conexión con MetaMask
- Solicitud de préstamos con información detallada
- Seguimiento del estado de solicitudes
- Descarga de contratos en formato PDF

### Para Administradores
- Aprobación/rechazo de solicitudes de préstamo
- Visualización de todas las solicitudes pendientes
- Generación de contratos para préstamos aprobados

## Copyright

Copyright (c) 2025-2026 Víctor Cuaresma