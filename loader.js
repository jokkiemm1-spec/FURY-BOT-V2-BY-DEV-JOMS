const fs = require("fs");

function loadPlugins() {
    const plugins = new Map();
    const files = fs.readdirSync("./plugins");

    for (const file of files) {
        if (!file.endsWith(".js")) continue;

        const plugin = require(`./plugins/${file}`);

        if (plugin.name && plugin.run) {
            plugins.set(plugin.name, plugin.run);
        }
    }

    return plugins;
}

module.exports = { loadPlugins };
