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
            // IMPORTANTE: Nivel de corrección Alto para soportar logos grandes
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'H' // 'H' = High (Alto)
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
                margin: 5, // Reduje un poco el margen para que el logo aproveche más espacio
                imageSize: 0.6 // <--- AQUÍ ESTÁ EL CAMBIO (Antes 0.4)
                               // 0.6 significa que ocupa el 60% del QR
                               // No recomiendo poner más de 0.6 o podría dejar de leerse
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
