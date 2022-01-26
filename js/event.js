const readline = require('readline');
const { game_event } = require("./script");

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
    "TERMINAL"
];

async function fire_events(cur_mode) {
    for (const m of modes) {
        if (m == cur_mode) continue
        await game_event("VIM", m, {
            "data": {
                "value" : 0
            }
        });
    }

    await game_event("VIM", cur_mode, {
        "data": {
            "value" : 1,
        }
    })
}


rl.on('line', line => {
    let mode = "NORMAL";
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
        default:
            mode = "NORMAL";
    }
    fire_events(mode);
});

