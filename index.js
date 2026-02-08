const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const http = require('http');

// 1. Servidor web básico para que la nube no lo apague
http.createServer((req, res) => {
    res.write('Bot Vivo 24/7');
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('--- ESCANEA EL QR ABAJO ---');
});

client.on('ready', () => {
    console.log('¡Bot funcionando en la nube!');
});

client.on('message', async (message) => {
    const msgLower = message.body.toLowerCase();
    if (msgLower === '/lista') {
        const data = JSON.parse(fs.readFileSync('./links.json', 'utf8'));
        let res = '📂 *DISPONIBLE:*\n';
        Object.keys(data.apks).forEach(a => res += `- ${a}\n`);
        message.reply(res);
    }
    // ... tu lógica de /descargar aquí
});

client.initialize();client.initialize();
