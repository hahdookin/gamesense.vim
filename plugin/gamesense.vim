" Vim plugin for interacting with SteelSeries Gamesense products
" Last Change: 2022 Jan 25
" Maintainer:  Christopher Pane <ChrisPaneCS@gmail.com>
" License:     This file is placed in the public domain.

if exists("g:loaded_gamesense")
    finish
endif
let g:loaded_gamesense = 1

let s:save_cpo = &cpo
set cpo&vim

" Will expand to path/to/gamesense.vim/
let s:root = expand("<sfile>:p:h:h")

function EncodeMode(mode)
    if char2nr(a:mode) == 22 " Visual blockwise
        return "b"
    elseif a:mode ==# "V" " Visual linewise
        return "l"
    else
        return a:mode
    endif
endfunction

function! Probe(timer)
    let channel = job_getchannel(g:server)
    call ch_sendraw(channel, EncodeMode(mode()[0]) . "\n")
endfunction

let g:server = job_start("node " . s:root . "/js/event.js")
let loop = timer_start(250, 'Probe', {"repeat": -1})


let &cpo = s:save_cpo
unlet s:save_cpo
