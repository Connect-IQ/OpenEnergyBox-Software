const {InfluxDB, Point} = require('@influxdata/influxdb-client');
const ModbusRTU = require("modbus-serial");
const config = require('./config/config.json');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');


// Create a Modbus client instance
const client = new ModbusRTU();

// Use 'influxdb' as the host, not 'localhost' or '127.0.0.1'
const influxDB = new InfluxDB({
    url: 'http://influxdb:8086',  // Use the Docker service name for InfluxDB
    token: `${Buffer.from('targetxdbuser:targetxdbpassword').toString('base64')}`,  // Username and password encoded
});

// Write API for InfluxDB 1.8
const writeApi = influxDB.getWriteApi('', 'targetxdb', 'ns');

// Function to collect metrics from Modbus and write to InfluxDB
async function collectModbusMetrics() {

    await client.connectRTUBuffered("/dev/ttyAMA4", {baudRate: 9600});
    client.setID(config.modbusSlaveId);
    console.log("Connected to Modbus device.");
    setInterval(async () => {
        console.log("Reading");
        const fs = await readFirstSet();   // Read voltage, current, power
        console.log("Read 1st set");
        setTimeout(async () => {
            const ss = await readSecondSet(); // Read frequency and energy after a delay
            console.log("Read 2d set");
            setTimeout(async () => {
                const ts = await readThirdSet(); // Read total energy after another delay
                writeToInflux(fs, ss, ts);  // Write all values to InfluxDB
            }, 1000)
        }, 1000);  // Delay for second set of readings
    }, 30000); // Repeat every 30 seconds
}

function readModbusFloat(buffer, startIndex) {
    const high = buffer.readUInt16BE(startIndex);
    const low = buffer.readUInt16BE(startIndex + 2);
    const combinedBuffer = Buffer.alloc(4);
    combinedBuffer.writeUInt16BE(high, 0);
    combinedBuffer.writeUInt16BE(low, 2);
    return combinedBuffer.readFloatBE(0);
}

async function readFirstSet() {
    try {
        const data = await client.readInputRegisters(0, 80);  // Read 40 registers starting from 30001

        // Extracting values
        const voltage1 = readModbusFloat(data.buffer, 0);   // Offset 0 (30001–30002)
        const voltage2 = readModbusFloat(data.buffer, 4);   // Offset 4 (30003–30004)
        const voltage3 = readModbusFloat(data.buffer, 8);   // Offset 8 (30005–30006)
        const current1 = readModbusFloat(data.buffer, 12);  // Offset 12 (30007–30008)
        const current2 = readModbusFloat(data.buffer, 16);  // Offset 16 (30009–30010)
        const current3 = readModbusFloat(data.buffer, 20);  // Offset 20 (30011–30012)
        const power1 = readModbusFloat(data.buffer, 24);    // Offset 24 (30013–30014)
        const power2 = readModbusFloat(data.buffer, 28);    // Offset 28 (30015–30016)
        const power3 = readModbusFloat(data.buffer, 32);    // Offset 32 (30017–30018)

        const voltAmps1 = readModbusFloat(data.buffer, 36);    // Offset 36 (30019–30020)
        const voltAmps2 = readModbusFloat(data.buffer, 40);    // Offset 40 (30021–30022)
        const voltAmps3 = readModbusFloat(data.buffer, 44);    // Offset 44 (30023–30024)


        const reactivePower1 = readModbusFloat(data.buffer, 48);    // Offset 48 (30025–30026)
        const reactivePower2 = readModbusFloat(data.buffer, 52);    // Offset 52 (30027–30028)
        const reactivePower3 = readModbusFloat(data.buffer, 56);    // Offset 56 (30029–30030)

        const powerFactor1 = readModbusFloat(data.buffer, 60);    // Offset 60 (30031–30032)
        const powerFactor2 = readModbusFloat(data.buffer, 64);    // Offset 64 (30033–30034)
        const powerFactor3 = readModbusFloat(data.buffer, 68);    // Offset 68 (30035–30036)

        const phaseAngle1 = readModbusFloat(data.buffer, 72);    // Offset 72 (30037–30038)
        const phaseAngle2 = readModbusFloat(data.buffer, 76);    // Offset 76 (30039–30040)
        const phaseAngle3 = readModbusFloat(data.buffer, 80);    // Offset 80 (30041–30042)

        const avgToNeutral = readModbusFloat(data.buffer, 84);    // Offset 32 (30043–30044)
        const avgLineCurrent = readModbusFloat(data.buffer, 92);    // Offset 32 (30047–30048)
        const sumOfCurrents = readModbusFloat(data.buffer, 96);    // Offset 32 (30049–30050)
        const totalPower = readModbusFloat(data.buffer, 104);    // Offset 32 (30053–30054)
        const totalVoltAmps = readModbusFloat(data.buffer, 112);    // Offset 32 (30057–30058)

        console.log(`Voltage 1: ${voltage1} V`);
        console.log(`Voltage 2: ${voltage2} V`);
        console.log(`Voltage 3: ${voltage3} V`);
        console.log(`Current 1: ${current1} A`);
        console.log(`Current 2: ${current2} A`);
        console.log(`Current 3: ${current3} A`);
        console.log(`Power 1: ${power1} W`);
        console.log(`Power 2: ${power2} W`);
        console.log(`Power 3: ${power3} W`);
        console.log(`Volt-Amps 1: ${voltAmps1} VA`);
        console.log(`Volt-Amps 2: ${voltAmps2} VA`);
        console.log(`Volt-Amps 3: ${voltAmps3} VA`);
        console.log(`Reactive Power 1: ${reactivePower1} VAR`);
        console.log(`Reactive Power 2: ${reactivePower2} VAR`);
        console.log(`Reactive Power 3: ${reactivePower3} VAR`);
        console.log(`Power Factor 1: ${powerFactor1}`);
        console.log(`Power Factor 2: ${powerFactor2}`);
        console.log(`Power Factor 3: ${powerFactor3}`);
        console.log(`Phase Angle 1: ${phaseAngle1}`);
        console.log(`Phase Angle 2: ${phaseAngle2}`);
        console.log(`Phase Angle 3: ${phaseAngle3}`);
        console.log(`Average to Neutral: ${avgToNeutral}`);
        console.log(`Average Line Current: ${avgLineCurrent}`);
        console.log(`Sum of Currents: ${sumOfCurrents}`);
        console.log(`Total Power: ${totalPower}`);
        console.log(`Total Volt-Amps: ${totalVoltAmps}`);

        return {
            voltage1: voltage1,
            voltage2: voltage2,
            voltage3: voltage3,
            current1: current1,
            current2: current2,
            current3: current3,
            power1: power1,
            power2: power2,
            power3: power3,
            voltAmps1: voltAmps1,
            voltAmps2: voltAmps2,
            voltAmps3: voltAmps3,
            reactivePower1: reactivePower1,
            reactivePower2: reactivePower2,
            reactivePower3: reactivePower3,
            powerFactor1: powerFactor1,
            powerFactor2: powerFactor2,
            powerFactor3: powerFactor3,
            phaseAngle1: phaseAngle1,
            phaseAngle2: phaseAngle2,
            phaseAngle3: phaseAngle3,
            avgToNeutral: avgToNeutral,
            avgLineCurrent: avgLineCurrent,
            sumOfCurrents: sumOfCurrents,
            totalPower: totalPower,
            totalVoltAmps: totalVoltAmps
        };
    } catch (readErr) {
        console.error("Error reading first set of Modbus registers:", readErr.message);
    }
}

async function readSecondSet() {
    try {
        const data = await client.readInputRegisters(70, 10);  // Read 10 registers starting from 30071

        // Extracting values
        const frequency = readModbusFloat(data.buffer, 0);     // Offset 0 (30071–30072)
        const importKwh = readModbusFloat(data.buffer, 4);     // Offset 4 (30073–30074)

        console.log(`Frequency: ${frequency} Hz`);
        console.log(`Import Energy: ${importKwh} kWh`);

        return {frequency: frequency, importKwh: importKwh};
    } catch (readErr) {
        console.error("Error reading second set of Modbus registers:", readErr.message);
    }
}


async function readThirdSet() {
    try {
        const data = await client.readInputRegisters(342, 70);  // Read 10 registers starting from 30071

        // Extracting values
        const totalKwh = readModbusFloat(data.buffer, 0);     // Offset 0 (30343–30344)
        const totalKvarh = readModbusFloat(data.buffer, 4);     // Offset 4 (30345–30346)
        const l1ImportKwh = readModbusFloat(data.buffer, 8);     // Offset 4 (30347–30348)
        const l2ImportKwh = readModbusFloat(data.buffer, 12);     // Offset 4 (30349–30350)
        const l3ImportKwh = readModbusFloat(data.buffer, 16);     // Offset 4 (30351–30352)
        const l1ExportKwh = readModbusFloat(data.buffer, 20);     // Offset 4 (30353–30354)
        const l2ExportKwh = readModbusFloat(data.buffer, 24);     // Offset 4 (30355–30356)
        const l3ExportKwh = readModbusFloat(data.buffer, 28);     // Offset 4 (30357–30358)
        const l1TotalKwh = readModbusFloat(data.buffer, 32);     // Offset 4 (30359–30360)
        const l2TotalKwh = readModbusFloat(data.buffer, 36);     // Offset 4 (30361–30362)
        const l3TotalKwh = readModbusFloat(data.buffer, 40);     // Offset 4 (30363–30364)
        const l1ImportKvarh = readModbusFloat(data.buffer, 44);     // Offset 4 (30365–30366)
        const l2ImportKvarh = readModbusFloat(data.buffer, 48);     // Offset 4 (30367–30368)
        const l3ImportKvarh = readModbusFloat(data.buffer, 52);     // Offset 4 (30369–30370)
        const l1ExportKvarh = readModbusFloat(data.buffer, 56);     // Offset 4 (30371–30372)
        const l2ExportKvarh = readModbusFloat(data.buffer, 60);     // Offset 4 (30373–30074)
        const l3ExportKvarh = readModbusFloat(data.buffer, 64);     // Offset 4 (30375–30076)

        console.log(`Total kWh: ${totalKwh} kWh`);
        console.log(`Total kvarh: ${totalKvarh} kvarh`);
        console.log(`L1 Import kWh: ${l1ImportKwh} kWh`);
        console.log(`L2 Import kWh: ${l2ImportKwh} kWh`);
        console.log(`L3 Import kWh: ${l3ImportKwh} kWh`);
        console.log(`L1 Export kWh: ${l1ExportKwh} kWh`);
        console.log(`L2 Export kWh: ${l2ExportKwh} kWh`);
        console.log(`L3 Export kWh: ${l3ExportKwh} kWh`);

        console.log(`L1 Total kWh: ${l1TotalKwh} kWh`);
        console.log(`L2 Total kWh: ${l2TotalKwh} kWh`);

        console.log(`L3 Total kWh: ${l3TotalKwh} kWh`);
        console.log(`L1 Import kvarh: ${l1ImportKvarh} kvarh`);
        console.log(`L2 Import kvarh: ${l2ImportKvarh} kvarh`);
        console.log(`L3 Import kvarh: ${l3ImportKvarh} kvarh`);
        console.log(`L1 Export kvarh: ${l1ExportKvarh} kvarh`);
        console.log(`L2 Export kvarh: ${l2ExportKvarh} kvarh`);
        console.log(`L3 Export kvarh: ${l3ExportKvarh} kvarh`);

        return {
            totalKwh: totalKwh,
            totalKvarh: totalKvarh,
            l1ImportKwh: l1ImportKwh,
            l2ImportKwh: l2ImportKwh,
            l3ImportKwh: l3ImportKwh,
            l1ExportKwh: l1ExportKwh,
            l2ExportKwh: l2ExportKwh,
            l3ExportKwh: l3ExportKwh,
            l1TotalKwh: l1TotalKwh,
            l2TotalKwh: l2TotalKwh,
            l3TotalKwh: l3TotalKwh,
            l1ImportKvarh: l1ImportKvarh,
            l2ImportKvarh: l2ImportKvarh,
            l3ImportKvarh: l3ImportKvarh,
            l1ExportKvarh: l1ExportKvarh,
            l2ExportKvarh: l2ExportKvarh,
            l3ExportKvarh: l3ExportKvarh
        };


    } catch (readErr) {
        console.error("Error reading second set of Modbus registers:", readErr.message);
    }
}

function writeToInflux(firstSet, secondSet, thirdSet) {
    const point = new Point('energy')
        .floatField('voltage1', firstSet.voltage1)
        .floatField('voltage2', firstSet.voltage2)
        .floatField('voltage3', firstSet.voltage3)
        .floatField('current1', firstSet.current1)
        .floatField('current2', firstSet.current2)
        .floatField('current3', firstSet.current3)
        .floatField('power1', firstSet.power1)
        .floatField('power2', firstSet.power2)
        .floatField('power3', firstSet.power3)
        .floatField('voltAmps1', firstSet.voltAmps1)
        .floatField('voltAmps2', firstSet.voltAmps2)
        .floatField('voltAmps3', firstSet.voltAmps3)
        .floatField('reactivePower1', firstSet.reactivePower1)
        .floatField('reactivePower2', firstSet.reactivePower2)
        .floatField('reactivePower3', firstSet.reactivePower3)
        .floatField('powerFactor1', firstSet.powerFactor1)
        .floatField('powerFactor2', firstSet.powerFactor2)
        .floatField('powerFactor3', firstSet.powerFactor3)
        .floatField('phaseAngle1', firstSet.phaseAngle1)
        .floatField('phaseAngle2', firstSet.phaseAngle2)
        .floatField('phaseAngle3', firstSet.phaseAngle3)
        .floatField('avgToNeutral', firstSet.avgToNeutral)
        .floatField('avgLineCurrent', firstSet.avgLineCurrent)
        .floatField('sumOfCurrents', firstSet.sumOfCurrents)
        .floatField('totalPower', firstSet.totalPower)
        .floatField('totalVoltAmps', firstSet.totalVoltAmps)
        .floatField('frequency', secondSet.frequency)
        .floatField('importKwh', secondSet.importKwh)
        .floatField('totalKwh', thirdSet.totalKwh)
        .floatField('totalKvarh', thirdSet.totalKvarh)
        .floatField('l1ImportKwh', thirdSet.l1ImportKwh)
        .floatField('l2ImportKwh', thirdSet.l2ImportKwh)
        .floatField('l3ImportKwh', thirdSet.l3ImportKwh)
        .floatField('l1ExportKwh', thirdSet.l1ExportKwh)
        .floatField('l2ExportKwh', thirdSet.l2ExportKwh)
        .floatField('l3ExportKwh', thirdSet.l3ExportKwh)
        .floatField('l1TotalKwh', thirdSet.l1TotalKwh)
        .floatField('l2TotalKwh', thirdSet.l2TotalKwh)
        .floatField('l3TotalKwh', thirdSet.l3TotalKwh)
        .floatField('l1ImportKvarh', thirdSet.l1ImportKvarh)
        .floatField('l2ImportKvarh', thirdSet.l2ImportKvarh)
        .floatField('l3ImportKvarh', thirdSet.l3ImportKvarh)
        .floatField('l1ExportKvarh', thirdSet.l1ExportKvarh)
        .floatField('l2ExportKvarh', thirdSet.l2ExportKvarh)
        .floatField('l3ExportKvarh', thirdSet.l3ExportKvarh)
        .timestamp(new Date());

    writeApi.writePoint(point);

// Flush the writes and close the connection
    writeApi
        .close()
        .then(() => {
            console.log('Write completed');
        })
        .catch((error) => {
            console.error('Error writing data to InfluxDB', error);
        });
    console.log("Metrics written to InfluxDB");

    // Publish machine data to MQTT brokers
    const topic = `data/${machineName}/energy`;
    const message = JSON.stringify(point);
    sendToMqtts(
        process.env.MQTT_BROKER_URL_LOCAL,
        {
            url: process.env.MQTT_BROKER_URL_REMOTE,
            username: process.env.MQTT_BROKER_URL_REMOTE_USER,
            password: process.env.MQTT_BROKER_URL_REMOTE_PASSWORD,
        },
        topic,
        message
    );

}

// Function to start the continuous metric collection
function startModbusMetricsCollection() {
    collectModbusMetrics();
}

async function sendToMqtts(localBroker, remoteBroker, topic, message) {
    // Connect to the local MQTT broker
    const localClient = mqtt.connect(localBroker);

    // Connect to the remote MQTT broker with authentication
    const remoteClient = mqtt.connect(remoteBroker.url, {
        username: remoteBroker.username,
        password: remoteBroker.password,
    });

    // Send messages when connected
    localClient.on('connect', () => {
        console.log('Connected to local MQTT broker');
        localClient.publish(topic, message, { qos: 1 }, (err) => {
            if (err) console.error('Error publishing to local broker:', err);
            localClient.end();
        });
    });

    remoteClient.on('connect', () => {
        console.log('Connected to remote MQTT broker');
        remoteClient.publish(topic, message, { qos: 1 }, (err) => {
            if (err) console.error('Error publishing to remote broker:', err);
            remoteClient.end();
        });
    });

    // Handle errors
    localClient.on('error', (err) => {
        console.error('Local MQTT client error:', err);
    });

    remoteClient.on('error', (err) => {
        console.error('Remote MQTT client error:', err);
    });
}

module.exports = {
    startModbusMetricsCollection
};
