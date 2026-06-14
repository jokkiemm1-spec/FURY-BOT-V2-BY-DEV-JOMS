const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { loadPlugins } = require("./loader");
const { app, setSock } = require("./web");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    setSock(sock);

    const plugins = loadPlugins();

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

        if (!text || !text.startsWith(".")) return;

        const args = text.slice(1).trim().split(" ");
        const cmd = args.shift().toLowerCase();

        if (plugins.has(cmd)) {
            plugins.get(cmd)(sock, msg, args);
        }
    });

    console.log("DEV JOM AI BOT RUNNING");
}

app.listen(3000, () => {
    console.log("WEB PANEL RUNNING");
});

startBot();
