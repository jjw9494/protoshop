## Protoshop

## Macro Plan -
- Create a photo editing application that run in the browser with the ability to log in and upload images.
- Front end using Next
- Back end using Go
- Photo editing done using C, compliled using emscripted and run in the browser using Web Assembly
- AWS for auth and file storage
- Jest for testing

## MVP
- upload photo into front-end and then use the C functions for editing.
- Core functions
    - upload photo
    - contrast
    - brightness
    - RGB

- To begin
    - upload photo
        - drop or click
        - read in file and ascertain file type, height and width
    - brightness

## Devlog
- Set up Next/Jest using a repo I previously created to do just that.

## NOTES

-- EMCC --
- EMCC compiler must be activated per terminal so on new session, run:
    - source ../../emsdk/emsdk_env.sh 
    - emcc -v

- To compile functions with EMCC for use in main codebase, we must include
    - # include <emscripten.h> (C compiler will complain but emcc will compile)
    - We must also head each function with - EMSCRIPTEN_KEEPALIVE
    - To compile we need to use the following flags 
       emcc <filename>.c -o <filename>.js \
        -s MODULARIZE=1 \
        -s EXPORT_ES6=1 \
        -s ENVIRONMENT=web \
        -s NO_EXIT_RUNTIME=1 \
        -s EXPORTED_RUNTIME_METHODS=ccall,cwrap \
        -s EXPORTED_FUNCTIONS="['_EMSCRIPTEN_MALLOC','_EMSCRIPTEN_FREE', <functionname>,'_main']" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -O3
    