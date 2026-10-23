
  const $ = (id) => document.getElementById(id);
  let currentImage = null; // data URI a describir

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

  $("gen").onclick = async () => {
    const prompt = $("prompt").value.trim();
    if (!prompt) return ($("genOut").innerHTML = '<span class="err">Escribe un prompt primero.</span>');
    $("gen").disabled = true; $("genOut").textContent = "Generando…";
    try {
      const r = await fetch("/api/generate", { method:"POST", body: JSON.stringify({ prompt }) });
      if (!r.ok) throw new Error((await r.json()).error);
      currentImage = await toDataURI(await r.blob());
      $("genOut").innerHTML = '<img alt="Imagen generada" src="' + currentImage + '">';
      $("toDescribe").hidden = false;
    } catch (e) { $("genOut").innerHTML = '<span class="err">' + e.message + '</span>'; }
    $("gen").disabled = false;
  };

  $("file").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    currentImage = await shrink(await toDataURI(f));
    $("descOut").innerHTML = '<img alt="Vista previa" src="' + currentImage + '">';
  };

  async function describe() {
    if (!currentImage) return ($("descOut").innerHTML = '<span class="err">Sube o genera una imagen primero.</span>');
    $("desc").disabled = true;
    const preview = '<img alt="Imagen a describir" src="' + currentImage + '"><p>Describiendo…</p>';
    $("descOut").innerHTML = preview;
    try {
      const img = await shrink(currentImage);
      const r = await fetch("/api/describe", { method:"POST", body: JSON.stringify({ image: img, question: $("q").value }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      const p = document.createElement("pre"); p.textContent = data.text;
      $("descOut").innerHTML = '<img alt="Imagen descrita" src="' + currentImage + '"><br>'; $("descOut").appendChild(p);
    } catch (e) { $("descOut").innerHTML = '<span class="err">' + e.message + '</span>'; }
    $("desc").disabled = false;
  }
  $("desc").onclick = describe;
  $("toDescribe").onclick = () => { $("descOut").scrollIntoView({behavior:"smooth"}); describe(); };

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
        '<p><strong>Prompt:</strong> ' + data.prompt + '</p>' +
        '<img alt="Imagen reimaginada" src="' + data.image + '">';
    } catch (e) { $("reOut").innerHTML = '<span class="err">' + e.message + '</span>'; }
    $("reBtn").disabled = false;
  };
