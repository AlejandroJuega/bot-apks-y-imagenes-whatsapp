const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('Escanea el QR para iniciar sesión');
});

client.on('ready', () => {
    console.log('¡Bot Multimedia Listo!');
});

client.on('message', async (message) => {
    const msgLower = message.body.toLowerCase();

    // COMANDO: /lista
    if (msgLower === '/lista') {
        try {
            const data = JSON.parse(fs.readFileSync('./links.json', 'utf8'));
            
            let respuesta = '📂 *CONTENIDO DISPONIBLE* 📂\n\n';

            // Sección de APKs
            respuesta += '📦 *APKs Disponibles:*\n';
            Object.keys(data.apks).forEach(app => {
                respuesta += `- ${app}\n`;
            });

            // Sección de Fondos
            respuesta += '\n🖼️ *Fondos de Pantalla:*\n';
            Object.keys(data.fondos).forEach(fondo => {
                respuesta += `- ${fondo}\n`;
            });

            respuesta += '\nUsa: */descargar [nombre]*';
            message.reply(respuesta);
        } catch (err) {
            message.reply('❌ Error al generar la lista.');
        }
    }

    // COMANDO: /descargar [nombre]
    if (msgLower.startsWith('/descargar ')) {
        const nombrePedido = msgLower.split('/descargar ')[1].trim();
        
        try {
            const data = JSON.parse(fs.readFileSync('./links.json', 'utf8'));

            // Buscamos en ambas categorías (apks y fondos)
            const todasLasKeys = { ...data.apks, ...data.fondos };
            
            // Buscamos la coincidencia sin importar mayúsculas
            const llaveReal = Object.keys(todasLasKeys).find(k => k.toLowerCase() === nombrePedido);

            if (llaveReal) {
                const link = todasLasKeys[llaveReal];
                await message.reply(`✅ *${llaveReal.toUpperCase()}* localizado.\n\n🚀 *Link de descarga:* \n${link}`);
            } else {
                message.reply(`❌ No encontré nada llamado *${nombrePedido}*.\nEscribe */lista* para ver lo disponible.`);
            }
        } catch (err) {
            message.reply('❌ Error al procesar la descarga.');
        }
    }
});

client.initialize();