# gamesense.vim
(N)Vim plugin for asynchronous SteelSeries GameSense interaction.

## Requirements
- Node.JS (no external dependencies required)
- (N)Vim with `+timers`, `+channel`, `+job`
- SteelSeries GameSense supported platform (Windows, Mac)
- SteelSeries GameSense supported device

## Installation
Install with a plugin manager:
```
Plug 'hahdookin/gamesense.vim'
```

## Features
- Illuminate function keys based on current mode.
- Draw current mode to OLED (Currently only for 128x40 pixel OLEDs)

## Why Node is required
Interaction with SteelSeries GameSense occurs through http POST requests. As far as I know, Vim does not have any API for sending http requests natively. When the plugin is invoked, a Node.JS server is created in the background and awaits messages from Vim. The plugin will send a message to the server periodically and the server will fire the event to the SteelSeries GameSense product.

## Plans
- [ ] User options
    - Custom colorschemes
    - Set bitmap inversion
    - Optionally send events
- [ ] Support multiple devices
    - 128x36 OLED: Rival 700, Rival 710
    - 128x48 OLED: Arctis Pro Wireless
    - 128x52 OLED: GameDAC / Arctis Pro + GameDAC
- [ ] Use curl for http requests
