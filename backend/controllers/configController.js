const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.join(__dirname, '../config/config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Update Configuration
function updateConfig(newConfig) {
    config = { ...config, ...newConfig };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function getConfig() {
    return config;
}

module.exports = {
    updateConfig,
    getConfig
};
