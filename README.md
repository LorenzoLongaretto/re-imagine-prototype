# Re-imagine

Upload a photo and let AI reimagine it. A vision model describes the image, and a diffusion model generates a new image based on that description.

**Live Demo:** [re-imagine.lorenzolongaretto.workers.dev](https://re-imagine.lorenzolongaretto.workers.dev/)

<!-- Add a screenshot or GIF showing the original and reimagined images -->

## How It Works

1. **Input:** The user uploads a photo, which is resized in the browser to a maximum dimension of 1024 pixels.
2. **Visual Understanding:** Llama 3.2 11B Vision Instruct analyzes the image and generates a concise English prompt.
3. **Image Generation:** Stable Diffusion XL Lightning generates a new image from that prompt.
4. **Result:** The original photo and the reimagined image are displayed side by side.

The output of one model feeds directly into the next, creating an automated pipeline that combines visual understanding and image generation in a single request.

## Tech Stack

- **Cloudflare Workers** — Serverless application runtime.
- **Cloudflare Workers AI** — AI model inference.
- **TypeScript** — Application logic, with a lightweight frontend built using HTML, CSS, and JavaScript in a single file.

### AI Models

| Model | Purpose |
|---|---|
| `@cf/meta/llama-3.2-11b-vision-instruct` | Image-to-text |
| `@cf/bytedance/stable-diffusion-xl-lightning` | Text-to-image |

## Running Locally

```bash
npm install
npx wrangler dev
```

Requires a Cloudflare account with Workers AI access. Ensure your Wrangler configuration includes the `AI` binding.

## Note on AI Models

This project uses freely available models through Cloudflare Workers AI for demonstration purposes. The quality of the generated images depends on the capabilities of the models used.

Since the image generation process relies on a textual description rather than the original image itself, the result may differ significantly from the input. More advanced models could produce more detailed descriptions and higher-quality images.

## Author

**Lorenzo Longaretto** · [GitHub](https://github.com/lorenzolongaretto)