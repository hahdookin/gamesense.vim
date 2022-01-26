" Vim plugin for interacting with SteelSeries Gamesense products
" Last Change: 2022 Jan 25
" Maintainer:  Christopher Pane <ChrisPaneCS@gmail.com>
" License:     This file is placed in the public domain.

if exists("g:loaded_gamesense")
    finish
endif
let g:loaded_gamesense = 1

if !has("timers") || !has("channel") || !has("job")
    echoe "gamesense.vim requires Vim with +timers, +channel, +job"
    finish
endif

let s:save_cpo = &cpo
set cpo&vim

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

" Start the server and get the channel
let s:server = job_start("node " . s:root . "/js/event.js")
let s:channel = job_getchannel(s:server)

" Run loop indefinitely
let s:loop = timer_start(
                \ 250, 
                \ {-> execute("call Probe(s:channel)")}, 
                \ {"repeat": -1})

let &cpo = s:save_cpo
unlet s:save_cpo
