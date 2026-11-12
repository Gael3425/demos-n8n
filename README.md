# Demos n8n · Gael

Dos demos reales de automatización con **n8n self-hosted**, grabados de punta a punta.
No son maquetas: webhooks reales, tablas de datos y ejecuciones en vivo, incluido el caso
de fallo.

**Ver la página:** https://gael3425.github.io/demos-n8n/

## Videos

| Demo | Duración | Qué muestra |
|---|---|---|
| [Carritos abandonados](videos/demo-1-carrito.mp4) | 1:58 | Tres entradas, máquina de estados, idempotencia, fallo de API con 3 reintentos, recuperación |
| [Leads y facturas](videos/demo-2-leads-facturas.mp4) | 1:28 | Formulario → validación → deduplicación → CRM; PDF → validación de importes → Excel |

## Estándar

- Errores explícitos y registrados, nunca silenciosos.
- Reintentos con espera, sin duplicar etapas ya completadas.
- Entradas repetibles sin duplicados: clave de deduplicación antes de escribir.
- Estado por etapa en Data Tables, con auditoría.
- Sticky notes y documentación dentro del workflow.
- Export JSON incluido.

## Notas

- Los videos usan datos de demostración, no datos reales de clientes.
- El portafolio completo (workflows, documentación y videos) está en un repositorio privado.
- Para contratar una implementación: https://github.com/Gael3425
