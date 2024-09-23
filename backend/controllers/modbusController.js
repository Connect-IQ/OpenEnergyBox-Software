// controllers/modbusController.js
const { ModbusMaster } = require('modbus-rtu');
const { SerialPort } = require('serialport');
const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.join(__dirname, '../config/config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Helper function to convert two 16-bit registers into a 32-bit floating-point number (Big Endian)
function registersToFloatBE(high, low) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt16BE(high, 0);  // Write the high 16 bits first
    buffer.writeUInt16BE(low, 2);   // Write the low 16 bits second
    return buffer.readFloatBE(0);   // Read as a 32-bit float (big-endian)
}

// Process Modbus data
function processModbusData(modbusRegisters, registerMap) {
    const categorizedValues = {};

    for (const [registerAddress, registerInfo] of Object.entries(registerMap)) {
        const startIdx = (registerAddress - 30001) * 2; // Calculate the start index in the array

        if (startIdx >= 0 && startIdx + 1 < modbusRegisters.length) {
            const high = modbusRegisters[startIdx];  // High register first for Big Endian
            const low = modbusRegisters[startIdx + 1]; // Low register second for Big Endian

            if (registerInfo.type === "float") {
                const value = registersToFloatBE(high, low);  // Convert to float (Big Endian)
                categorizedValues[registerInfo.label] = parseFloat(value.toFixed(2));  // Round to 2 decimal places
            }
        }
    }

    return categorizedValues;
}

// Read Modbus Registers
async function readModbusRegisters() {
    const serialport = new SerialPort({ path: config.modbusPort, baudRate: config.baudRate });
    const master = new ModbusMaster(serialport);

    return master.readHoldingRegisters(2, 0, config.modbusRegistersToRead)
        .then((data) => {
            // Process and return categorized values
            return processModbusData(data, config.registerMap);
        })
        .catch((err) => {
            console.error('Error reading Modbus data:', err);
            throw err;
        });
}

module.exports = {
    readModbusRegisters
};
