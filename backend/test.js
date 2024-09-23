const ModbusRTU = require("modbus-serial");

// Helper function to read and combine two 16-bit Modbus registers into a 32-bit float
function readModbusFloat(buffer, startIndex) {
    const high = buffer.readUInt16BE(startIndex);
    const low = buffer.readUInt16BE(startIndex + 2);
    const combinedBuffer = Buffer.alloc(4);
    combinedBuffer.writeUInt16BE(high, 0);
    combinedBuffer.writeUInt16BE(low, 2);
    return combinedBuffer.readFloatBE(0);
}

function readEnergyData() {
    const client = new ModbusRTU();
    client.setID(2);
// open connection to a serial port
    client.connectRTUBuffered("/dev/ttyAMA4", { baudRate: 9600 });
    client.readHoldingRegisters(0, 60)  // Read registers starting from 30001
        .then((data) => {
            // Voltage from registers 30001-30002
            const voltage = readModbusFloat(data.buffer, 0);   // Offset 0 (30001)
            // Current from registers 30007-30008
            const current = readModbusFloat(data.buffer, 12);  // Offset 12 (30007)
            // Active Power from registers 30013-30014
            const power = readModbusFloat(data.buffer, 24);    // Offset 24 (30013)
            // Frequency from registers 30071-30072
            const frequency = readModbusFloat(data.buffer, 140); // Offset 140 (30071)
            // Import Active Energy from registers 30073-30074
            const importKwh = readModbusFloat(data.buffer, 144); // Offset 144 (30073)

            console.log(`Voltage: ${voltage} V`);
            console.log(`Current: ${current} A`);
            console.log(`Power: ${power} W`);
            console.log(`Frequency: ${frequency} Hz`);
            console.log(`Import Energy: ${importKwh} kWh`);
        })
        .catch((err) => {
            console.error(`Error reading Modbus registers: ${err.message}`);
        });
}

readEnergyData()
