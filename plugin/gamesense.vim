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

function! Probe(timer)
    let newmode = mode()[0]
    if char2nr(newmode) == 22 " Visual blockwise
        let newmode = "b"
    elseif newmode ==# "V" " Visual linewise
        let newmode = "l"
    endif

    let event_msg = job_start("node " . s:root . "/js/event.js " . newmode)
    call job_stop(event_msg)
endfunction

function StartEventLoop(timer)
    let timer = timer_start(250, 'Probe', {"repeat": -1})
endfunction

function GameSenseInvoke()
    let startup = job_start("node " . s:root . "/js/startup.js", {"close_cb": 'StartEventLoop'})
endfunction

call GameSenseInvoke()

let &cpo = s:save_cpo
unlet s:save_cpo
