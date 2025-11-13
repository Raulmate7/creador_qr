document.addEventListener('DOMContentLoaded', () => {
    const qrTextInput = document.getElementById('qr-text');
    const logoUploadInput = document.getElementById('logo-upload');
    const logoTextSpan = document.getElementById('logo-text');
    const generateBtn = document.getElementById('generate-btn');
    const canvasContainer = document.getElementById('canvas-container');
    const downloadBtn = document.getElementById('download-btn');
    const uploadZone = document.getElementById('upload-zone');

    let qrCode = null; 
    let uploadedLogoUrl = null;

    // Efecto visual al seleccionar archivo
    logoUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedLogoUrl = e.target.result;
                logoTextSpan.textContent = "✅ " + file.name;
                uploadZone.style.borderColor = "#23d5ab"; 
                uploadZone.style.backgroundColor = "#e0fdf4";
            };
            reader.readAsDataURL(file);
        }
    });

    generateBtn.addEventListener('click', () => {
        const text = qrTextInput.value;
        if (!text) {
            qrTextInput.style.borderColor = "#ff4757";
            setTimeout(() => qrTextInput.style.borderColor = "#e0e0e0", 500);
            return;
        }

        // Resetear contenedor
        canvasContainer.innerHTML = '';
        canvasContainer.classList.remove('show'); 

        const qrOptions = {
            width: 280,
            height: 280,
            data: text,
            image: uploadedLogoUrl || '',
            // IMPORTANTE: Nivel de corrección Alto es CRÍTICO para logos grandes
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'H' // 'H' = High (Alto), permite hasta un 30% de daño
            },
            dotsOptions: {
                color: '#1a1a1a',
                type: 'rounded' 
            },
            cornersSquareOptions: {
                type: 'extra-rounded' 
            },
            backgroundOptions: {
                color: '#ffffff',
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 0, // <--- CAMBIO: Margen a 0 para maximizar el logo
                imageSize: 0.75 // <--- CAMBIO: Tamaño de la imagen a 75%
                               // ADVERTENCIA: Más allá de 0.75, los códigos QR
                               // pueden volverse muy difíciles de leer para los móviles.
            }
        };

        qrCode = new QRCodeStyling(qrOptions);
        qrCode.append(canvasContainer);
        
        setTimeout(() => {
            canvasContainer.classList.add('show');
            downloadBtn.classList.remove('hidden');
        }, 100);
    });

    downloadBtn.addEventListener('click', () => {
        if (qrCode) {
            qrCode.download({ name: 'mi-qr-pro', extension: 'png' });
        }
    });
});
