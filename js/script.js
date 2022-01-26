const http = require('http');
const fs = require('fs');
const { images } = require('./bmp');

// Paths of coreProps.json
const mac_path = "/Library/Application Support/SteelSeries Engine 3/coreProps.json";
const windows_path = "C:\\ProgramData\\SteelSeries\\SteelSeries Engine 3\\coreProps.json";

const platform = process.platform;
let path;
switch (platform) {
    case 'win32':
        path = windows_path;
        break;
    case 'darwin':
        path = mac_path;
        break;
    default:
        console.log(`Sorry, ${platform} is not supported.`);
        process.exit(1);
}

if (!fs.existsSync(path)) {
    console.log("Couldn't find coreProps.json: " + path + " does not exist");
    process.exit(1);
}

// Grab port from coreProps.json
const address = JSON.parse(fs.readFileSync(path))["address"];
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
            if (res.statusCode < 200 || res.statusCode >= 300)
                return reject(new Error("statusCode=" + res.statusCode))

            let body = [];
            res.on('data', d => {
                body.push(d);
            });
            res.on('end', () => {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', err => {
            reject(err);
        });
        req.write(obj);
        req.end();
    });
}

async function register_game(game, display_name, developer) {
    const res = await send_put_request("game_metadata", {
        "game": game,
        "game_display_name": display_name,
        "developer": developer
    });
}

async function game_event(game, event, obj) {
    await send_put_request("game_event", {
        "game": game,
        "event": event,
        ...obj
    });
}
async function bind_game_event(game, event, obj) {
    const res = await send_put_request("bind_game_event", {
        "game": game,
        "event": event,
        ...obj
    });
}

async function bind_mode_change_event(mode, rgb) {
    const [r, g, b] = rgb;
    await bind_game_event("VIM", mode.toUpperCase(), {
        "handlers": [
            // Light up function keys handler
            {
                "device-type": "keyboard",
                "zone": "function-keys",
                "color": {
                    "red": r,
                    "green": g,
                    "blue": b,
                },
                "mode": "color",
            },
            // Draw mode bitmap to OLED handler
            {
                "device-type": "screened-128x40",
                "mode": "screen",
                "zone": "one",
                "datas": [{
                    "has-text": false,
                    "image-data": images[mode]
                }]
            }
        ]
    });
}

async function setupAll() {
    await register_game("VIM", "(N)Vim", "Christopher Pane");

    // Bind event handlers for modes
    await bind_mode_change_event("NORMAL", [0x8a, 0xc6, 0xf2]);
    await bind_mode_change_event("INSERT", [0x95, 0xe4, 0x54]);
    await bind_mode_change_event("REPLACE", [0xeb, 0x4f, 0x3f]);
    await bind_mode_change_event("VISUAL", [0xf2, 0xc6, 0x8a]);
    await bind_mode_change_event("V-LINE", [0xf2, 0xc6, 0x8a]);
    await bind_mode_change_event("V-BLOCK", [0xf2, 0xc6, 0x8a]);
    await bind_mode_change_event("TERMINAL", [0x8a, 0xc6, 0xf2]);
    await bind_mode_change_event("COMMAND", [0x8a, 0xc6, 0xf2]);
}


exports.setupAll = setupAll;
exports.game_event = game_event;
