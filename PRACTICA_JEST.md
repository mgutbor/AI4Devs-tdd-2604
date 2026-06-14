# Configuración realizada

## Objetivo

Configurar el backend del proyecto para ejecutar pruebas unitarias escritas en TypeScript mediante Jest utilizando el comando npm test.

## Pasos realizados

- Revisadas las dependencias de testing existentes en el proyecto.
- Verificada la presencia de Jest, ts-jest y @types/jest.
- Simplificada la configuración de Jest para TypeScript.
- Verificado el script npm test en package.json.
- Creada una prueba de validación para comprobar el funcionamiento del entorno.

## Archivos modificados

- backend/jest.config.js
- backend/src/application/validator.test.ts

## Ejecución

```bash
cd backend
npm install
npm test
```