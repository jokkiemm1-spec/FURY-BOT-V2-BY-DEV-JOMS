const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sockGlobal = null;

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head><title>DEV JOM AI BOT</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:50px">
            <h2>DEV JOM AI BOT PAIRING</h2>
            <form method="POST" action="/pair">
                <input name="number" placeholder="234XXXXXXXXXX" style="padding:10px;font-size:16px" required />
                <button style="padding:10px 20px;font-size:16px">Generate Code</button>
            </form>
        </body>
        </html>
    `);
});

app.post("/pair", async (req, res) => {
    const number = req.body.number;

    if (!sockGlobal) {
        return res.send("<h2>Bot not ready yet. Refresh in 10 seconds.</h2>");
    }

    try {
        const code = await sockGlobal.requestPairingCode(number);
        res.send(`<h1>Your WhatsApp Code: ${code}</h1><p>Go to WhatsApp → Linked Devices → Link with phone number</p>`);
    } catch (e) {
        res.send("<h2>Error: Make sure number starts with 234... No + sign</h2>");
    }
});

function setSock(sock) {
    sockGlobal = sock;
}

module.exports = { app, setSock };
