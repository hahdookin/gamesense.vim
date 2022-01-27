const readline = require('readline');
const { game_event, bind_mode_change_event } = require("./script");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const modes = [
    "INSERT",
    "NORMAL",
    "REPLACE",
    "VISUAL",
    "V-LINE",
    "V-BLOCK",
    "TERMINAL",
    "COMMAND"
];

async function fire_events(cur_mode) {
    // Disable all other events
    for (const m of modes) {
        if (m == cur_mode) continue
        await game_event("VIM", m, {
            "data": {
                "value" : 0
            }
        });
    }

    // Finally, fire the current event
    const promise = await game_event("VIM", cur_mode, {
        "data": {
            "value" : 1,
        }
    })
    return promise;
}

// #123456 -> [0x12, 0x34, 0x56]
function hexstring_to_bytes(hexstring) {
    if (hexstring.startsWith('#'))
        hexstring = hexstring.substring(1);
    return [
        Number.parseInt("0x" + hexstring.substring(0, 2)),
        Number.parseInt("0x" + hexstring.substring(2, 4)),
        Number.parseInt("0x" + hexstring.substring(4, 6)),
    ];
}


rl.on('line', line => {

    // Option setting messages start with '_'
    // i.e. _INSERT=#123456
    if (line.startsWith("_")) {
        line = line.substring(1);
        let [mode, color] = line.split('=');
        bind_mode_change_event(mode, hexstring_to_bytes(color));
        return;
    }
    let mode = "x";
    switch (line.trim()[0]) {
        case 'n':
            mode = "NORMAL";
            break;
        case 'v':
            mode = "VISUAL";
            break;
        case 'b':
            mode = "V-BLOCK";
            break;
        case 'l':
            mode = "V-LINE";
            break;
        case 'i':
            mode = "INSERT";
            break;
        case 'R':
            mode = "REPLACE";
            break;
        case 't':
            mode = "TERMINAL";
            break;
        case 'c':
            mode = "COMMAND";
            break;
        // default:
        //     mode = "NORMAL";
    }
    fire_events(mode)
    .then(res => process.stdout.write(res.toString() + "\n"))
    .catch(err => process.stdout.write("ERROR" + "\n"));
});

