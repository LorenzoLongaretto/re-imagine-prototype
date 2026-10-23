# Re-imagine

An AI-powered application that transforms ideas and photographs into new visual experiences using generative AI and vision-language models.

**Live Demo:** [re-imagine.lorenzolongaretto.workers.dev](https://re-imagine.lorenzolongaretto.workers.dev/)

## Overview

Re-imagine combines image understanding and image generation in a single application. Users can generate images from text prompts, analyze photographs using natural language, or reimagine existing images through AI-generated descriptions.

The project explores how different AI models can work together to create an interactive, multimodal experience.

## Features

- **Text-to-Image Generation:** Create images from natural-language descriptions.
- **Image Description:** Upload a photograph and ask questions about its contents. The application analyzes the image and responds in Spanish.
- **Image Reimagining:** Upload a photograph, generate a textual description of its visual content, and use that description to generate a new image.
- **Interactive Interface:** Access the different AI capabilities through a single web application.

## How It Works

The image reimagining workflow connects two AI models with complementary capabilities:

1. **Image Input:** The user uploads a photograph.
2. **Visual Understanding:** Llama 3.2 11B Vision Instruct analyzes the image and generates a textual description.
3. **Image Generation:** Stable Diffusion XL Lightning uses the description as a prompt to generate a new image.
4. **Result:** The generated image is presented to the user.

This pipeline demonstrates how outputs from one AI model can serve as inputs to another, combining visual understanding and generative capabilities in a single workflow.

## AI Models

| Model | Purpose |
|---|---|
| Llama 3.2 11B Vision Instruct | Image understanding and textual description generation |
| Stable Diffusion XL Lightning | Image generation from text prompts |


## Note on AI Models

This project uses freely available AI models for demonstration purposes. The quality of the generated images and their similarity to the original input depend largely on the capabilities of the models used.

More advanced models may produce more accurate image descriptions and higher-quality results. Therefore, the current output should be considered a demonstration of the workflow rather than a reflection of the full potential of these technologies.

## Try It Out

Visit the live application:

**[Open Re-imagine](https://re-imagine.lorenzolongaretto.workers.dev/)**

No local installation is required to try the deployed version.


## Author

**Lorenzo Longaretto**

[GitHub](https://github.com/lorenzolongaretto)