const fs = require('fs');
const path = require('path');

const rows = 40;
const cols = 128;
const bbp = 1;
const datastart = 0x3e; // 62

let invert = true;
function read_bmp(source) {
    const imgdata = [...source.slice(datastart)];
    const res = [];

    for (let row = rows - 1; row >= 0; row--)
        for (let col = 0; col < cols/8; col++)
            if (invert) {
                res.push(imgdata[(cols / 8) * row + col] ^ 0xff);
            } else {
                res.push(imgdata[(cols / 8) * row + col]);
            }

    return res;
}

const images = {};

const normalbmp = fs.readFileSync(path.resolve(__dirname, "..\\bmps\\normal.bmp"));
images["NORMAL"] = read_bmp(normalbmp);

const insertbmp = fs.readFileSync(path.resolve(__dirname, "..\\bmps\\insert.bmp"));
images["INSERT"] = read_bmp(insertbmp);

const replacebmp = fs.readFileSync(path.resolve(__dirname, "..\\bmps\\replace.bmp"));
images["REPLACE"] = read_bmp(replacebmp);

const visualbmp = fs.readFileSync(path.resolve(__dirname, "..\\bmps\\visual.bmp"));
images["VISUAL"] = read_bmp(visualbmp);

const vlinebmp = fs.readFileSync(path.resolve(__dirname, "..\\bmps\\vline.bmp"));
images["V-LINE"] = read_bmp(vlinebmp);

const vblockbmp = fs.readFileSync(path.resolve(__dirname, "..\\bmps\\vblock.bmp"));
images["V-BLOCK"] = read_bmp(vblockbmp);

const terminalbmp = fs.readFileSync(path.resolve(__dirname, "..\\bmps\\terminal.bmp"));
images["TERMINAL"] = read_bmp(terminalbmp);

const commandbmp = fs.readFileSync(path.resolve(__dirname, "..\\bmps\\command.bmp"));
images["COMMAND"] = read_bmp(commandbmp);

exports.images = images;

