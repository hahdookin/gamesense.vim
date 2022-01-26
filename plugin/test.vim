function MyFn(job, status)
    echo "JOB FINSIHED"
endfunc

let job = job_start('node ../js/startup.js', {"exit_cb": 'MyFn'})
" , "in_io": "null", "out_io": "null", "err_io": "null"})
