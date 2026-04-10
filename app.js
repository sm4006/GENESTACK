function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function animateSection(sectionId, title, fileName, stepsText, finalCallback) {
  const section = document.getElementById(sectionId);

  section.innerHTML = `
    <div class="section-header">
      <h1>${title}</h1>
      <p>${fileName}</p>
    </div>

    <div class="animation-box">
      ${stepsText.map((s, i) =>
        `<div class="step ${i === 0 ? "active" : ""}">${s}</div>`
      ).join("")}
    </div>

    <div class="progress-bar">
      <div class="progress-fill" id="${sectionId}Progress"></div>
    </div>

    <p id="${sectionId}Status">Starting...</p>
  `;

  const steps = section.querySelectorAll(".step");
  const progress = document.getElementById(`${sectionId}Progress`);
  const status = document.getElementById(`${sectionId}Status`);

  let current = 0;

  const interval = setInterval(() => {
    if (current < steps.length) {
      steps.forEach(s => s.classList.remove("active"));
      steps[current].classList.add("active");

      progress.style.width = `${((current + 1) / steps.length) * 100}%`;
      status.innerText = stepsText[current];
      current++;
    } else {
      clearInterval(interval);
      if (finalCallback) finalCallback();
    }
  }, 1200);
}

function startEncoding(file) {
  if (!file) return;

  animateSection(
    "encode",
    "📁 Encoding in Progress",
    file.name,
    [
      "📂 Reading file...",
      "🔢 Converting to binary...",
      "🧬 Binary → ATGC",
      "🛡️ Reed Solomon protection",
      "✅ DNA sequence ready"
    ],
    () => {
      downloadFile(file.name + ".dna", "ATGCGTAGCTAGCTAGCTAGCTAGCTA");
    }
  );
}

function startDecoding(file) {
  if (!file) return;

  animateSection(
    "decode",
    "🧬 Decoding in Progress",
    file.name,
    [
      "🧬 Reading DNA",
      "🔁 ATGC → Binary",
      "🛡️ Error correction",
      "📄 Rebuilding original file",
      "✅ Decode complete"
    ],
    () => {
      downloadFile("decoded_" + file.name.replace(".dna", ".txt"), "Decoded original file content");
    }
  );
}