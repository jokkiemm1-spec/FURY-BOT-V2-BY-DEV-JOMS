const express = require("express");
const app = express();

app.use(express.json());

let sockGlobal = null;

app.get("/", (req, res) => {
    res.send(`
        <h2>DEV JOM AI BOT PAIRING</h2>
        <form method="POST" action="/pair">
            <input name="number" placeholder="234XXXXXXXXXX" />
            <button>Generate Code</button>
        </form>
    `);
});

app.post("/pair", async (req, res) => {
    const number = req.body.number;

    if (!sockGlobal) {
        return res.send("Bot not ready");
    }

    try {
        const code = await sockGlobal.requestPairingCode(number);
        res.send(`<h1>Your Code: ${code}</h1>`);
    } catch (e) {
        res.send("Error generating code");
    }
});

function setSock(sock) {
    sockGlobal = sock;
}

module.exports = { app, setSock };
