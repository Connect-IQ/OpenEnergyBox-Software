const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

async function connectAndRead() {
    try {
        // Open connection to the serial port
        await client.connectRTUBuffered("/dev/ttyAMA4", { baudRate: 9600 });
        client.setID(2);

        console.log("Connected to Modbus device.");

        // Read values from the device once connected
        setInterval(async function() {
            try {
                const data = await client.readHoldingRegisters(0, 10);
                console.log(data.data);
            } catch (readErr) {
                console.error("Error reading Modbus registers:", readErr.message);
            }
        }, 1000); // Read every second
    } catch (err) {
        console.error("Failed to connect to Modbus device:", err.message);
    }
}

// Start the connection and reading process
connectAndRead();
