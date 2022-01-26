const http = require('http');
const fs = require('fs');
const { images } = require('./bmp');
const windows_path = "C:\\ProgramData\\SteelSeries\\SteelSeries Engine 3\\coreProps.json";
if (!fs.existsSync(windows_path)) {
    console.log(windows_path + " does not exist");
    process.exit(1);
}
// Grab port from coreProps.json
const address = JSON.parse(fs.readFileSync(windows_path))["address"];
const port = address.substring(address.indexOf(":") + 1);


function send_put_request(endpoint, obj) {
    obj = JSON.stringify(obj);
    const options = {
        hostname: "localhost",
        port: port,
        path: `/${endpoint}`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
    };
    return new Promise((resolve, reject) => {
        const req = http.request(options, res => {
            console.log("STATUS CODE: " + res.statusCode);
            console.log();
            res.on('data', d => {
                process.stdout.write(d)
            });
            req.on('end', () => {
                console.log("No more data!");

            })
            req.on('error', e => {
                console.log("ERROR" + e);
                reject(e);
            });
        });
        req.write(obj);
        resolve(req.end());
    });
}

console.log("About to put request");
let x = send_put_request("game_event", {
    "game": "VIM",
    "event": "INSERT",
    "data": {
        "value": 1
    }
}).then((response) => {
    console.log("put request finished")
}).catch(err => { console.log(err) })
