const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const {InfluxDB, Point} = require("@influxdata/influxdb-client");

async function loginAndScrape(url, username, password) {
    return new Promise(async (resolve, reject) => {
        const influxDB = new InfluxDB({
            url: 'http://influxdb:8086',  // Use the Docker service name for InfluxDB
            token: `${Buffer.from('targetxdbuser:targetxdbpassword').toString('base64')}`,  // Username and password encoded
        });
        const writeApi = influxDB.getWriteApi('', 'targetxdb', 'ns');

        // Launch the browser
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium', // Adjust based on the installed path
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for Docker environments
        });
        const page = await browser.newPage();

        // Go to the login page
        await page.goto(url, {waitUntil: 'networkidle2'});

        // Fill in the username field
        await page.type('input[name="username"]', username); // Select the username input
        await page.click('.continue-button'); // Click the forward button

        // Wait for the password input to become visible
        await page.waitForSelector('input[name="password"]');

        // Fill in the password field
        await page.type('input[name="password"]', password); // Select the password input

        // Click the Login button
        await page.click('#submit-button'); // Click the login button

        // Wait for the page to load after login
        await page.waitForNavigation({waitUntil: 'networkidle2'});

        // Navigate to the machine data page after login
        await page.goto('https://api.pars-connect.com/livedata#', {waitUntil: 'networkidle2'});

        // Get the HTML content of the page after login
        const content = await page.content();

        // Load the content into cheerio for scraping
        const $ = cheerio.load(content);

        // Array to store machine data
        let machines = [];

        // Scrape the machine data
        $('.card').each((index, element) => {
            const machineTitle = $(element).find('.card-title').text().trim();

            const isDisconnected = $(element).find('.machine-disconnected').length > 0;

            if (isDisconnected) {
                console.log(`Skipping ${machineTitle} as it is disconnected.`);
                return; // Skip this iteration
            }

            const details = {};

            // Get each detail row inside the detail-area table
            $(element).find('.detail-area table tr').each((i, row) => {
                const key = $(row).find('.title').text().replace(':', '').trim();
                const value = $(row).find('td:nth-child(2)').text().trim();
                console.log(key)
                let name = ''
                if (key == 'Verim') {
                    name = 'capacity'
                } else if (key == 'Gramaj') {
                    name = 'product_weight'
                } else if (key == 'Kalınlık') {
                    name = 'thickness'
                } else if (key == 'Hat Hızı') {
                    name = 'line_speed'
                } else {
                    name = key
                }

                let v = value.split(' ')
                details[name] = parseFloat(v[0]).toFixed(2);
            });
            console.log(details)

            let machineName = machineTitle.replace(' ', '_').toLowerCase()

            machines.push({
                name: machineName,
                capacity: details.capacity,
                product_weight: details.product_weight,
                thickness: details.thickness,
                line_speed: details.line_speed,
                timestamp: new Date().getTime()
            });


            const point = new Point(machineName)
                .floatField('capacity', details.capacity)
                .floatField('product_weight', details.product_weight)
                .floatField('thickness', details.thickness)
                .floatField('line_speed', details.line_speed)
                .timestamp(new Date().getTime());
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
            // Push the machine data to the array

        });

        // Output the scraped machine data
        console.log(machines);

        // Close the browser
        await browser.close();

        resolve(machines);
    })

}

// Replace with your actual login page URL, username, and password
module.exports = {
    loginAndScrape
};

