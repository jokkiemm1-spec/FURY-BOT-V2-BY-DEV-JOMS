const { default: makeWASocket, useMultiFileAuthState, Browsers } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require('fs');
const { app, setSock } = require("./web");

if (fs.existsSync('auth')) {
    fs.rmSync('auth', { recursive: true, force: true });
    console.log('Deleted old session');
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" }),
        browser: Browsers.ubuntu('Chrome')
    });

    sock.ev.on("creds.update", saveCreds);
    setSock(sock);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        if (text === ".ping") {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "🏓 DEV JOM AI BOT is alive!"
            });
        }
    });

    console.log("DEV JOM AI BOT RUNNING");
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("WEB PANEL RUNNING ON", PORT);
});

startBot();
