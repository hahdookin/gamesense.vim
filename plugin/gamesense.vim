" Vim plugin for interacting with SteelSeries Gamesense products
" Last Change: 2022 Jan 25
" Maintainer:  Christopher Pane <ChrisPaneCS@gmail.com>
" License:     This file is placed in the public domain.

if exists("g:loaded_gamesense")
    finish
endif
let g:loaded_gamesense = 1

if !executable("node")
    echoe "gamesense.vim requires Node.JS"
    finish
endif

if !has("timers") || !has("channel") || !has("job")
    echoe "gamesense.vim requires Vim with +timers, +channel, +job"
    finish
endif

let s:save_cpo = &cpo
set cpo&vim

""""""""""""""""""""""""""
" Options
""""""""""""""""""""""""""

let g:gamesense_update_rate = 250

let g:gamesense_colors = {}
let g:gamesense_colors["NORMAL"]   = "#8ac6f2"
let g:gamesense_colors["INSERT"]   = "#95e454"
let g:gamesense_colors["REPLACE"]  = "#eb4f3f"
let g:gamesense_colors["VISUAL"]   = "#f2c68a"
let g:gamesense_colors["V-LINE"]   = g:gamesense_colors["VISUAL"]
let g:gamesense_colors["V-BLOCK"]  = g:gamesense_colors["VISUAL"]
let g:gamesense_colors["TERMINAL"] = g:gamesense_colors["INSERT"]
let g:gamesense_colors["COMMAND"]  = g:gamesense_colors["NORMAL"]

" Will expand to path/to/gamesense.vim/
let s:root = expand("<sfile>:p:h:h")

" Returns a special value from the result of mode()[0]
" that the server knows how to deal with.
" n -> n
" i -> i
" R -> R
" v -> v
" V -> l
" nr2char(22) -> b
" c -> c
" t -> t
function EncodedMode()
    let l:mode = mode()[0]
    if char2nr(l:mode) == 22 " Visual blockwise
        return "b"
    elseif l:mode ==# "V" " Visual linewise
        return "l"
    else
        return l:mode
    endif
endfunction

" Send the current mode to the server
function! Probe(channel)
    call ch_sendraw(a:channel, EncodedMode() . "\n")
endfunction

function! SendOptions(channel)
    for [key, value] in items(g:gamesense_colors)
        call ch_sendraw(a:channel, "_" . key . "=" . value . "\n")
    endfor
endfunction

" Start the server and get the channel
let s:server = job_start("node " . s:root . "/js/server.js")
let s:channel = job_getchannel(s:server)

" call ch_sendraw(s:channel, "n" . "\n")
" let res = ch_read(s:channel)
" if res ==# "ERROR"
"     " Normal event doesn't exist, run setup
"     echo "STARTUP HERE"
" endif

call SendOptions(s:channel)

" Run loop indefinitely
let s:loop = timer_start(
                \ g:gamesense_update_rate, 
                \ {-> execute("call Probe(s:channel)")}, 
                \ {"repeat": -1})

let &cpo = s:save_cpo
unlet s:save_cpo
