const { default: makeWASocket, useMultiFileAuthState, Browsers } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require('fs');
const { loadPlugins } = require("./loader");
const { app, setSock } = require("./web");

// Delete old session so pairing works fresh
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

    const plugins = loadPlugins();

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text ||!text.startsWith(".")) return;

        const args = text.slice(1).trim().split(" ");
        const cmd = args.shift().toLowerCase();

        if (plugins.has(cmd)) {
            plugins.get(cmd)(sock, msg, args);
        }
    });

    console.log("DEV JOM AI BOT RUNNING");
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("WEB PANEL RUNNING ON", PORT);
});

startBot();
