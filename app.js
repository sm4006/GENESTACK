const DNA_MAPPING = {
    '00': 'A',
    '01': 'T',
    '10': 'G',
    '11': 'C'
};

const REVERSE_DNA_MAPPING = {
    'A': '00',
    'T': '01',
    'G': '10',
    'C': '11'
};

let currentEncodedFile = null;
let currentDecodedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload();
    setupDecodeUpload();
    setupNavigation();
});

function setupFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleEncodeFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleEncodeFile(file);
    });
}

function setupDecodeUpload() {
    const decodeZone = document.getElementById('decodeZone');
    const decodeInput = document.getElementById('decodeInput');

    if (!decodeZone || !decodeInput) return;

    decodeZone.addEventListener('click', () => decodeInput.click());

    decodeInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleDecodeFile(file);
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);

            document.querySelectorAll('.section-container').forEach(section => {
                section.style.display = 'none';
            });

            const target = document.getElementById(sectionId);
            if (target) target.style.display = 'block';
        });
    });
}

function handleEncodeFile(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
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

        downloadEncoded();
    };

    reader.readAsArrayBuffer(file);
}

function handleDecodeFile(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        const dna = e.target.result.trim();
        let bytes = [];

        for (let i = 0; i < dna.length; i += 4) {
            let byte = 0;

            for (let j = 0; j < 4; j++) {
                const bits = REVERSE_DNA_MAPPING[dna[i + j]];
                byte = (byte << 2) | parseInt(bits, 2);
            }

            bytes.push(byte);
        }

        currentDecodedFile = new Uint8Array(bytes);
        downloadDecoded(file.name.replace('.dna', '_decoded'));
    };

    reader.readAsText(file);
}

function downloadEncoded() {
    const blob = new Blob([currentEncodedFile.data], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = currentEncodedFile.filename;
    a.click();
}

function downloadDecoded(filename) {
    const blob = new Blob([currentDecodedFile]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}