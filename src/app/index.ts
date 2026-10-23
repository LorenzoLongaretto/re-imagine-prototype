const IMG_MODEL = "@cf/bytedance/stable-diffusion-xl-lightning" as const;
const VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct" as const;

interface Env {
  AI: Ai;
}

interface GenerateBody {
  prompt?: string;
}

interface DescribeBody {
  image?: string; // data URI
  question?: string;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

const REIMAGINE_PROMPT =
  "Describe esta imagen como un prompt conciso en inglés (máximo 40 palabras) para generar una imagen parecida. Devuelve solo el prompt, sin explicaciones ni comillas.";

// Paso imagen -> texto con el modelo de visión
async function imageToPrompt(env: Env, image: string): Promise<string> {
  const result = (await env.AI.run(VISION_MODEL, {
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: REIMAGINE_PROMPT },
          { type: "image_url", image_url: { url: image } },
        ],
      },
    ],
  } as any)) as { response?: string };
  return (result.response ?? "").trim();
}

function base64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === "GET" && pathname === "/") {
      return new Response(HTML, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (request.method !== "POST") return json({ error: "No encontrado" }, 404);

    try {
      // Texto -> imagen
      if (pathname === "/api/generate") {
        const { prompt } = (await request.json()) as GenerateBody;
        if (!prompt || prompt.length > 500)
          return json({ error: "Escribe un prompt de hasta 500 caracteres." }, 400);

        const stream = await env.AI.run(IMG_MODEL, { prompt, num_steps: 8 });
        return new Response(stream, { headers: { "content-type": "image/jpeg" } });
      }

      // Imagen -> texto
      if (pathname === "/api/describe") {
        const { image, question } = (await request.json()) as DescribeBody;
        if (!image?.startsWith("data:image/"))
          return json({ error: "Sube una imagen válida." }, 400);

        const result = (await env.AI.run(VISION_MODEL, {
          max_tokens: 512,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: question || "Describe esta imagen en español, con detalle.",
                },
                { type: "image_url", image_url: { url: image } },
              ],
            },
          ],
        } as any)) as { response?: string };

        return json({ text: result.response ?? "" });
      }

      // Imagen -> texto -> imagen (la cadena "re-imagine")
      if (pathname === "/api/reimagine") {
        const { image } = (await request.json()) as DescribeBody;
        if (!image?.startsWith("data:image/"))
          return json({ error: "Sube una imagen válida." }, 400);

        // Paso 1: la foto original -> un prompt de texto
        const prompt = await imageToPrompt(env, image);
        if (!prompt) return json({ error: "No se pudo describir la imagen." }, 502);

        // Paso 2: ese texto -> una imagen nueva
        const stream = await env.AI.run(IMG_MODEL, { prompt, num_steps: 8 });
        const bytes = new Uint8Array(await new Response(stream).arrayBuffer());

        return json({ prompt, image: `data:image/jpeg;base64,${base64(bytes)}` });
      }
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : String(e) }, 500);
    }
    return json({ error: "No encontrado" }, 404);
  },
} satisfies ExportedHandler<Env>;

const HTML = /* html */ `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Re-imagine</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;800&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root { --bg:#eef1f6; --ink:#16213a; --blue:#2b4bff; --sun:#ffc83d; --line:#c9d1e3; --card:#fff; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0f1526; --ink:#e8ecf8; --blue:#8aa0ff; --sun:#ffc83d; --line:#2a3454; --card:#171f38; }
  }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:17px/1.55 "Source Sans 3", system-ui, sans-serif; }
  main { max-width: 600px; margin: 0 auto; padding: 40px 20px 64px; }
  h1 { font:800 clamp(2.2rem,6vw,3.6rem)/1.02 "Bricolage Grotesque", sans-serif; margin:0 0 8px; letter-spacing:-.02em; }
  h1 span { background: linear-gradient(transparent 62%, var(--sun) 62%); }
  .sub { margin:0 0 36px; max-width:60ch; opacity:.8; }
  section { background:var(--card); border:2px solid var(--ink); border-radius:14px; padding:22px; box-shadow:6px 6px 0 var(--blue); }
  h2 { font:800 1.35rem "Bricolage Grotesque", sans-serif; margin:0 0 14px; }
  input:focus, button:focus-visible { outline:3px solid var(--sun); outline-offset:2px; }
  button { font:600 1rem "Source Sans 3"; cursor:pointer; margin-top:12px; padding:10px 18px; border-radius:8px; border:2px solid var(--ink); background:var(--sun); color:#16213a; }
  button:disabled { opacity:.5; cursor:wait; }
  .out { margin-top:16px; min-height:40px; }
  .out img { width:100%; border-radius:8px; border:2px solid var(--line); display:block; }
  .out img + img { margin-top:12px; }
  .err { color:#d8344a; font-weight:600; }
</style>
</head>
<body>
<main>
  <h1>Re- <span>imagine</span></h1>
  <p class="sub">Sube una foto y la IA la reimagina como una imagen nueva.</p>
  <section>
    <h2>Reimaginar una foto</h2>
    <label for="reFile">Sube una foto</label>
    <input id="reFile" type="file" accept="image/*">
    <button id="reBtn">Reimaginar</button>
    <div class="out" id="reOut" aria-live="polite"></div>
  </section>
</main>
<script>
  const $ = (id) => document.getElementById(id);

  const toDataURI = (blob) => new Promise((res) => {
    const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob);
  });

  // Reduce la imagen para que la petición sea ligera y rápida
  async function shrink(dataURI, max = 1024) {
    const img = new Image(); img.src = dataURI; await img.decode();
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = img.width * k; c.height = img.height * k;
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.85);
  }

  // Reimaginar: foto -> texto -> imagen nueva
  let reImage = null;
  $("reFile").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    reImage = await shrink(await toDataURI(f));
    $("reOut").innerHTML = '<img alt="Foto original" src="' + reImage + '">';
  };
  $("reBtn").onclick = async () => {
    if (!reImage) return ($("reOut").innerHTML = '<span class="err">Sube una foto primero.</span>');
    $("reBtn").disabled = true;
    $("reOut").innerHTML = '<img alt="Foto original" src="' + reImage + '"><p>Reimaginando…</p>';
    try {
      const r = await fetch("/api/reimagine", { method:"POST", body: JSON.stringify({ image: reImage }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      $("reOut").innerHTML =
        '<img alt="Foto original" src="' + reImage + '">' +
        // '<p><strong>Prompt:</strong> ' + data.prompt + '</p>' +
        '<img alt="Imagen reimaginada" src="' + data.image + '">';
    } catch (e) { $("reOut").innerHTML = '<span class="err">' + e.message + '</span>'; }
    $("reBtn").disabled = false;
  };
</script>
</body>
</html>`;
