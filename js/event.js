const { argv } = require("process");
const { game_event } = require("./script");

const arg = process.argv[2][0];
let mode = "NORMAL";
switch (arg) {
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

const modes = [
    "INSERT",
    "NORMAL",
    "REPLACE",
    "VISUAL",
    "V-LINE",
    "V-BLOCK",
    "TERMINAL"
];

async function fire_events() {
    for (const m of modes) {
        if (m == mode) continue
        await game_event("VIM", m, {
            "data": {
                "value" : 0
            }
        });
    }

    await game_event("VIM", mode, {
        "data": {
            "value" : 1,
        }
    })
}

fire_events();

