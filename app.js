document.addEventListener('DOMContentLoaded', () => {
    const qrTextInput = document.getElementById('qr-text');
    const logoUploadInput = document.getElementById('logo-upload');
    const logoTextSpan = document.getElementById('logo-text');
    const generateBtn = document.getElementById('generate-btn');
    const canvasContainer = document.getElementById('canvas-container');
    const downloadBtn = document.getElementById('download-btn');

    let qrCode = null; 
    let uploadedLogoUrl = null; // Aquí guardaremos la imagen del usuario

    // 1. Escuchar cuando el usuario selecciona un archivo
    logoUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            // Leemos el archivo para poder mostrarlo
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedLogoUrl = e.target.result; // Guardamos la imagen
                logoTextSpan.textContent = "✅ " + file.name; // Cambiamos el texto del botón
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. Generar el QR
    generateBtn.addEventListener('click', () => {
        const text = qrTextInput.value;
        if (!text) {
            alert('Por favor, escribe una URL o texto.');
            return;
        }

        // Limpiamos el QR anterior
        canvasContainer.innerHTML = '';

        // Configuración del QR
        const qrOptions = {
            width: 300,
            height: 300,
            data: text,
            image: uploadedLogoUrl || '', // Usamos el logo si existe, si no, vacío
            dotsOptions: {
                color: '#000000',
                type: 'rounded'
            },
            backgroundOptions: {
                color: '#ffffff',
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 10,
                imageSize: 0.4 // Tamaño del logo (0.4 = 40% del QR)
            }
        };

        // Crear y dibujar el QR
        qrCode = new QRCodeStyling(qrOptions);
        qrCode.append(canvasContainer);
        
        // Mostrar botón de descarga
        downloadBtn.classList.remove('hidden');
    });

    // 3. Descargar el QR
    downloadBtn.addEventListener('click', () => {
        if (qrCode) {
            qrCode.download({ name: 'mi-qr-con-logo', extension: 'png' });
        }
    });
});
