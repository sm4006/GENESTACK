const DNA_MAPPING = { '00':'A','01':'T','10':'G','11':'C' };
const REVERSE_DNA_MAPPING = { 'A':'00','T':'01','G':'10','C':'11' };
let currentEncodedFile = null;

window.addEventListener('DOMContentLoaded', () => {
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handleEncodeFile(file);
    });
  }
});

async function handleEncodeFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const bytes = new Uint8Array(e.target.result);
    let dnaSequence = '';

    for (let byte of bytes) {
      for (let bit = 6; bit >= 0; bit -= 2) {
        const bits = ((byte >> bit) & 0b11).toString(2).padStart(2, '0');
        dnaSequence += DNA_MAPPING[bits];
      }
    }

    currentEncodedFile = {
      filename: file.name.replace(/\.[^/.]+$/, '') + '.dna',
      data: dnaSequence
    };

    await simulateEncodingUI(dnaSequence);
    downloadEncoded();
    closeProcessModal();
  };

  reader.readAsArrayBuffer(file);
}

function showProcessModal() {
  document.getElementById('processModal').classList.add('active');
}

function closeProcessModal() {
  document.getElementById('processModal').classList.remove('active');
}

async function simulateEncodingUI(dnaSequence) {
  showProcessModal();
  const start = Date.now();

  for (let i = 0; i <= 100; i += 10) {
    document.getElementById('progressFill').style.width = i + '%';
    document.getElementById('progressPercent').textContent = i + '%';
    document.getElementById('basesCount').textContent = Math.floor(dnaSequence.length * i / 100);
    document.getElementById('dnaPreview').textContent = dnaSequence.slice(0, Math.max(20, dnaSequence.length * i / 100)).slice(0, 300);
    document.getElementById('processTime').textContent = ((Date.now() - start) / 1000).toFixed(1) + 's';

    if (i < 40) document.getElementById('stage1').style.opacity = '1';
    else if (i < 80) document.getElementById('stage2').style.opacity = '1';
    else document.getElementById('stage3').style.opacity = '1';

    await new Promise(r => setTimeout(r, 180));
  }
}

function downloadEncoded() {
  const blob = new Blob([currentEncodedFile.data], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = currentEncodedFile.filename;
  a.click();
}