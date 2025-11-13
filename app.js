// DOM Elements
const urlInput = document.getElementById('urlInput');
const imageInput = document.getElementById('imageInput');
const imageUploadArea = document.getElementById('imageUploadArea');
const imageUploadText = document.getElementById('imageUploadText');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const qrPreviewContainer = document.getElementById('qrPreviewContainer');
const qrCanvas = document.getElementById('qrCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const emptyState = document.getElementById('emptyState');
const sizeBtns = document.querySelectorAll('.size-btn');

// State
let selectedImage = null;
let selectedImageData = null;
let currentQRSize = 400;
let currentQRCanvas = null;

// Event Listeners
imageUploadArea.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', handleImageSelect);
generateBtn.addEventListener('click', handleGenerateQR);
downloadBtn.addEventListener('click', downloadQR);

sizeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentQRSize = parseInt(e.target.dataset.size);
        
        // Regenerate QR if exists
        if (selectedImageData) {
            generateQRCode();
        }
    });
});

// Handle image selection
function handleImageSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Por favor selecciona una imagen válida');
        return;
    }
    
    selectedImage = file;
    imageUploadText.textContent = file.name;
    
    // Read and preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        selectedImageData = e.target.result;
        imagePreview.src = selectedImageData;
        imagePreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
    
    hideMessages();
}

// Handle QR generation
async function handleGenerateQR() {
    const url = urlInput.value.trim();
    
    // Validate URL
    if (!url) {
        showError('Por favor ingresa una URL válida');
        return;
    }
    
    // Validate URL format
    try {
        new URL(url);
    } catch {
        showError('La URL no es válida. Asegúrate de incluir http:// o https://');
        return;
    }
    
    if (!selectedImageData) {
        showError('Por favor selecciona una imagen para el centro del QR');
        return;
    }
    
    showLoading();
    
    try {
        generateQRCode();
        hideLoading();
    } catch (error) {
        console.error('Error generating QR:', error);
        hideLoading();
        showError('Error al generar el código QR: ' + error.message);
    }
}

// Generate QR Code with embedded image
function generateQRCode() {
    // Clear previous QR
    qrCanvas.innerHTML = '';
    
    // Create temporary canvas for QR
    const tempCanvas = document.createElement('canvas');
    
    // Generate QR code
    QRCode.toCanvas(tempCanvas, urlInput.value.trim(), {
        width: currentQRSize,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H' // High error correction for image overlay
    }, (error) => {
        if (error) {
            showError('Error al generar el código QR');
            console.error(error);
            return;
        }
        
        // Create final canvas with image overlay
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = currentQRSize;
        finalCanvas.height = currentQRSize;
        const ctx = finalCanvas.getContext('2d');
        
        // Draw QR code
        ctx.drawImage(tempCanvas, 0, 0);
        
        // Draw white background for image
        const imageSize = currentQRSize * 0.25; // 25% of QR size
        const x = (currentQRSize - imageSize) / 2;
        const y = (currentQRSize - imageSize) / 2;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x - 5, y - 5, imageSize + 10, imageSize + 10);
        
        // Draw image on top
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, x, y, imageSize, imageSize);
            
            // Display in preview
            currentQRCanvas = finalCanvas;
            displayQRPreview(finalCanvas);
            showSuccess();
        };
        img.onerror = () => {
            showError('Error al cargar la imagen');
        };
        img.src = selectedImageData;
    });
}

// Display QR preview
function displayQRPreview(canvas) {
    qrCanvas.innerHTML = '';
    qrCanvas.appendChild(canvas);
    emptyState.style.display = 'none';
    qrPreviewContainer.style.display = 'flex';
}

// Download QR code
function downloadQR() {
    if (!currentQRCanvas) return;
    
    const link = document.createElement('a');
    link.href = currentQRCanvas.toDataURL('image/png');
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show feedback
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '✓ Descargado';
    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
    }, 2000);
}

// UI Helper Functions
function showLoading() {
    loading.style.display = 'flex';
    generateBtn.disabled = true;
}

function hideLoading() {
    loading.style.display = 'none';
    generateBtn.disabled = false;
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

function showSuccess() {
    errorMessage.style.display = 'none';
}

function hideMessages() {
    errorMessage.style.display = 'none';
}
