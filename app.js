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
                uploadZone.style.borderColor = "#23d5ab"; // Borde verde
                uploadZone.style.backgroundColor = "#e0fdf4";
            };
            reader.readAsDataURL(file);
        }
    });

    generateBtn.addEventListener('click', () => {
        const text = qrTextInput.value;
        if (!text) {
            // Animación de error (sacudir input)
            qrTextInput.style.borderColor = "#ff4757";
            setTimeout(() => qrTextInput.style.borderColor = "#e0e0e0", 500);
            return;
        }

        // Resetear contenedor
        canvasContainer.innerHTML = '';
        canvasContainer.classList.remove('show'); // Resetear animación

        const qrOptions = {
            width: 280,
            height: 280,
            data: text,
            image: uploadedLogoUrl || '',
            dotsOptions: {
                color: '#1a1a1a',
                type: 'rounded' // Puntos redondeados (más moderno)
            },
            cornersSquareOptions: {
                type: 'extra-rounded' // Esquinas redondeadas
            },
            backgroundOptions: {
                color: '#ffffff',
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 10
            }
        };

        qrCode = new QRCodeStyling(qrOptions);
        qrCode.append(canvasContainer);
        
        // Activar animación y mostrar botón descarga
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
