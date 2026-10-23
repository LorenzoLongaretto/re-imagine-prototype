# Image-to-Image AI

## Descripción

Aplicación que utiliza modelos de inteligencia artificial para transformar una imagen de entrada en una nueva imagen generada a partir de su descripción textual.

El usuario puede tomar una fotografía o subir una imagen desde su dispositivo. A continuación, la aplicación utiliza **Llama 3.2 11B Vision Instruct** para analizar el contenido visual y generar una descripción en texto. Esta descripción se utiliza como *prompt* para **Stable Diffusion XL Lightning**, que genera una nueva imagen basada en el contenido de la original.

Finalmente, la aplicación muestra la imagen generada al usuario.

## Flujo de funcionamiento

1. **Entrada de imagen:** el usuario toma una fotografía o selecciona una imagen de su dispositivo.
2. **Análisis visual:** Llama 3.2 11B Vision Instruct interpreta la imagen y genera una descripción textual de su contenido.
3. **Generación de imagen:** Stable Diffusion XL Lightning utiliza la descripción como prompt para crear una nueva imagen.
4. **Visualización del resultado:** la aplicación presenta la imagen generada al usuario.

## Objetivo

Explorar la integración de modelos de inteligencia artificial con distintas capacidades —comprensión visual y generación de imágenes— para construir una aplicación que conecte ambos procesos en un flujo de trabajo automatizado.

## Modelos utilizados

- **Llama 3.2 11B Vision Instruct:** análisis e interpretación de imágenes para generar descripciones textuales.
- **Stable Diffusion XL Lightning:** generación de imágenes a partir de prompts de texto.