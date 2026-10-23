# Re-imagine

Sube una foto y una IA la reimagina: un modelo de visión la describe y un modelo de difusión genera una imagen nueva a partir de esa descripción.

**Demo:** [re-imagine.lorenzolongaretto.workers.dev](https://re-imagine.lorenzolongaretto.workers.dev/)

<!-- Aquí: captura o GIF con el antes y después -->

## Cómo funciona

1. **Entrada:** el usuario sube una foto (se reduce en el navegador a 1024 px).
2. **Comprensión visual:** Llama 3.2 11B Vision Instruct genera un prompt conciso en inglés.
3. **Generación:** Stable Diffusion XL Lightning crea una imagen nueva a partir de ese prompt.
4. **Resultado:** se muestran la foto original y la reimaginada.

La salida de un modelo se usa como entrada del otro, en una sola petición.

## Stack

- Cloudflare Workers + Workers AI
- TypeScript, sin dependencias de frontend (HTML/CSS/JS en un solo archivo)

| Modelo | Función |
|---|---|
| `@cf/meta/llama-3.2-11b-vision-instruct` | Imagen → texto |
| `@cf/bytedance/stable-diffusion-xl-lightning` | Texto → imagen |

## Ejecutar en local

    npm install
    npx wrangler dev

Requiere una cuenta de Cloudflare con Workers AI habilitado.

## Nota sobre los modelos

Usa modelos gratuitos de Workers AI. La similitud con la foto original depende de ellos; modelos más potentes darían descripciones y resultados más fieles.

## Autor

**Lorenzo Longaretto** · [GitHub](https://github.com/lorenzolongaretto)