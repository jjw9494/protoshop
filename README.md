## Protoshop

Front-End codebase for Protoshop Image Editing Application.

## NOTES

-- EMCC --

- EMCC compiler must be activated per terminal so on new session, run:
    - source ../../emsdk/emsdk_env.sh 
    - emcc -v

- To compile functions with EMCC for use in main codebase, we must include
    - # include <emscripten.h> (C compiler will complain but emcc will compile)
    - We must also head each function with - EMSCRIPTEN_KEEPALIVE
    - To compile we need to use the following flags 
        emcc editing_functions.c \
        -o editing_functions.js \
        -s MODULARIZE=1 \
        -s EXPORT_ES6=1 \
        -s ENVIRONMENT=web \
        -s NO_EXIT_RUNTIME=1 \
        -s EXPORTED_RUNTIME_METHODS=ccall,cwrap\
            -s "EXPORTED_FUNCTIONS=['_EMSCRIPTEN_MALLOC', '_EMSCRIPTEN_FREE', '_adjustBrightness','_adjustExposureEffect','_adjustContrastEffect','_adjustHighlights','_adjustWhites','_adjustBlacks','_adjustTemperatureEffect', '_adjustTintEffect', '_adjustVibranceEffect', '_adjustSaturationEffect', '_adjustSharpnessEffect', '_generateHistogram', '_adjustShadows', '_addGrain', '_adjustVignetteEffect']" \
            -s ALLOW_MEMORY_GROWTH=1 \
        -O3
