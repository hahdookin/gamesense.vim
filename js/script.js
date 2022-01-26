const http = require('http');
const fs = require('fs');
const { images } = require('./bmp');

// Paths of coreProps.json
const osx_path = "/Library/Application Support/SteelSeries Engine 3/coreProps.json";
const windows_path = "C:\\ProgramData\\SteelSeries\\SteelSeries Engine 3\\coreProps.json";

if (!fs.existsSync(windows_path)) {
    console.log(windows_path + " does not exist");
    process.exit(1);
}

// Grab port from coreProps.json
const address = JSON.parse(fs.readFileSync(windows_path))["address"];
const port = address.substring(address.indexOf(":") + 1);

async function send_put_request(endpoint, obj) {
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
    const req = http.request(options, res => {
        console.log("STATUS CODE: " + res.statusCode);
        console.log();
        res.on('data', d => process.stdout.write(d));
    });

    req.on('error', e => {
        console.log("ERROR" + e);
        console.log();
    });

    req.write(obj);
    return req.end();
}

async function register_game(game, display_name, developer) {
    await send_put_request("game_metadata", {
        "game": game,
        "game_display_name": display_name,
        "developer": developer
    });
}

async function remove_game(game) {
    await send_put_request("remove_game", {
        "game": game
    });
}
async function register_game_event(game, event, obj) {
    await send_put_request("register_game_event", {
        "game": game,
        "event": event,
        ...obj
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
    await send_put_request("bind_game_event", {
        "game": game,
        "event": event,
        ...obj
    });
}

async function bind_mode_change_event(mode, rgb) {
    console.log("Binding " + mode);
    const [r, g, b] = rgb;
    await bind_game_event("VIM", mode.toUpperCase(), {
        "handlers": [
            // Light up function keys
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
            // Draw mode bitmap to OLED
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
    console.log("registering game");
    await register_game("VIM", "(N)Vim", "Christopher Pane");

    // Bind event handlers for modes
    await bind_mode_change_event("NORMAL", [0x8a, 0xc6, 0xf2]);
    await bind_mode_change_event("INSERT", [0x95, 0xe4, 0x54]);
    await bind_mode_change_event("REPLACE", [0xeb, 0x4f, 0x3f]);
    await bind_mode_change_event("VISUAL", [0xf2, 0xc6, 0x8a]);
    await bind_mode_change_event("V-LINE", [0xf2, 0xc6, 0x8a]);
    await bind_mode_change_event("V-BLOCK", [0xf2, 0xc6, 0x8a]);
    await bind_mode_change_event("TERMINAL", [0x8a, 0xc6, 0xf2]);
}


exports.setupAll = setupAll;
exports.game_event = game_event;
