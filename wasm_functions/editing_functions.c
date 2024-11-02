// editing_functions.c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <emscripten.h>

float clamp(float value, float min, float max) {
    return value < min ? min : (value > max ? max : value);
}

float adjustContrast(float value, float contrast) {
    return clamp(((value - 0.5f) * contrast + 0.5f) * 255.0f, 0, 255);
}

float adjustExposure(float value, float exposure) {
    return clamp(value * powf(2.0f, exposure), 0, 255);
}

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
            pixels[i + j] = (unsigned char)clamp(newValue, 0, 255);
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustExposureEffect(unsigned char* pixels, int numPixels, float exposure) {
    if (!pixels) return;
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        for (int j = 0; j < 3; j++) {
            float value = (float)pixels[i + j];
            pixels[i + j] = (unsigned char)adjustExposure(value, exposure);
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustContrastEffect(unsigned char* pixels, int numPixels, float contrast) {
    if (!pixels) return;
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        for (int j = 0; j < 3; j++) {
            float value = (float)pixels[i + j] / 255.0f;
            pixels[i + j] = (unsigned char)adjustContrast(value, contrast);
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustHighlights(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    const float threshold = 0.6f; 
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        for (int j = 0; j < 3; j++) {
            float value = (float)pixels[i + j] / 255.0f;
            if (value > threshold) {
                float adjustment = (value - threshold) / (1.0f - threshold);
                float newValue = value + (adjustment * amount);
                pixels[i + j] = (unsigned char)clamp(newValue * 255.0f, 0, 255);
            }
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustShadows(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    const float threshold = 0.4f; 
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        for (int j = 0; j < 3; j++) {
            float value = (float)pixels[i + j] / 255.0f;
            if (value < threshold) {
                float adjustment = (threshold - value) / threshold;
                float newValue = value + (adjustment * amount);
                pixels[i + j] = (unsigned char)clamp(newValue * 255.0f, 0, 255);
            }
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustWhites(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    const float threshold = 0.8f; 

    for (int i = 0; i < numPixels * 4; i += 4) {
        for (int j = 0; j < 3; j++) {
            float value = (float)pixels[i + j] / 255.0f;
            if (value > threshold) {
                float adjustment = powf((value - threshold) / (1.0f - threshold), 2.0f);
                float newValue = value + (adjustment * amount);
                pixels[i + j] = (unsigned char)clamp(newValue * 255.0f, 0, 255);
            }
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustBlacks(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    const float threshold = 0.2f; 
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        for (int j = 0; j < 3; j++) {
            float value = (float)pixels[i + j] / 255.0f;
            if (value < threshold) {
                float adjustment = powf((threshold - value) / threshold, 2.0f);
                float newValue = value + (adjustment * amount);
                pixels[i + j] = (unsigned char)clamp(newValue * 255.0f, 0, 255);
            }
        }
    }
}

int main() {
    return 0;
}