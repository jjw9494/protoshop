#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Export malloc and free functions
EMSCRIPTEN_KEEPALIVE void* EMSCRIPTEN_MALLOC(size_t size) {
    return malloc(size);
}

EMSCRIPTEN_KEEPALIVE void EMSCRIPTEN_FREE(void* ptr) {
    free(ptr);
}

EMSCRIPTEN_KEEPALIVE
void adjustBrightness(unsigned char* pixels, int numPixels, float brightness) {
    if (!pixels) return;
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        for (int j = 0; j < 3; j++) {
            float newValue = pixels[i + j] * brightness;
            pixels[i + j] = (unsigned char)(newValue < 0 ? 0 : (newValue > 255 ? 255 : newValue));
        }
        pixels[i + 3] = pixels[i + 3];
    }
}

int main() {
    return 0;
}