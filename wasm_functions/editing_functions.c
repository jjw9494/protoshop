#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h> 
#include <emscripten.h>
#include <time.h>

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
        // Preserve alpha channel
        pixels[i + 3] = pixels[i + 3];
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
        // Preserve alpha channel
        pixels[i + 3] = pixels[i + 3];
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
        // Preserve alpha channel
        pixels[i + 3] = pixels[i + 3];
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
        // Preserve alpha channel
        pixels[i + 3] = pixels[i + 3];
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
        // Preserve alpha channel
        pixels[i + 3] = pixels[i + 3];
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
        // Preserve alpha channel
        pixels[i + 3] = pixels[i + 3];
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
        // Preserve alpha channel
        pixels[i + 3] = pixels[i + 3];
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustTemperatureEffect(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        float r = (float)pixels[i];
        float g = (float)pixels[i + 1];
        float b = (float)pixels[i + 2];

        float temp_matrix[3] = {
            1.0f + amount * 0.02f,  // Red
            1.0f,                   // Green
            1.0f - amount * 0.02f   // Blue
        };

        pixels[i] = (unsigned char)clamp(r * temp_matrix[0], 0, 255);
        pixels[i + 1] = (unsigned char)clamp(g * temp_matrix[1], 0, 255);
        pixels[i + 2] = (unsigned char)clamp(b * temp_matrix[2], 0, 255);
        // Preserve alpha
        pixels[i + 3] = pixels[i + 3];
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustTintEffect(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        float r = (float)pixels[i];
        float g = (float)pixels[i + 1];
        float b = (float)pixels[i + 2];

        float tint_matrix[3] = {
            1.0f - amount * 0.01f,  // Red
            1.0f + amount * 0.02f,  // Green
            1.0f - amount * 0.01f   // Blue
        };

        pixels[i] = (unsigned char)clamp(r * tint_matrix[0], 0, 255);
        pixels[i + 1] = (unsigned char)clamp(g * tint_matrix[1], 0, 255);
        pixels[i + 2] = (unsigned char)clamp(b * tint_matrix[2], 0, 255);
        // Preserve alpha
        pixels[i + 3] = pixels[i + 3];
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustVibranceEffect(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        float r = (float)pixels[i];
        float g = (float)pixels[i + 1];
        float b = (float)pixels[i + 2];

        float max_rgb = fmaxf(fmaxf(r, g), b) / 255.0f;
        float avg = (r + g + b) / (3.0f * 255.0f);
        float amt = (fabsf(max_rgb - avg) * 2.0f) * amount;

        pixels[i] = (unsigned char)clamp(r * (1.0f + amt), 0, 255);
        pixels[i + 1] = (unsigned char)clamp(g * (1.0f + amt), 0, 255);
        pixels[i + 2] = (unsigned char)clamp(b * (1.0f + amt), 0, 255);
        // Preserve alpha
        pixels[i + 3] = pixels[i + 3];
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustSaturationEffect(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        float r = (float)pixels[i];
        float g = (float)pixels[i + 1];
        float b = (float)pixels[i + 2];

        float luminance = (r * 0.299f + g * 0.587f + b * 0.114f) / 255.0f;
        
        pixels[i] = (unsigned char)clamp(luminance * 255.0f + (r - luminance * 255.0f) * (1.0f + amount), 0, 255);
        pixels[i + 1] = (unsigned char)clamp(luminance * 255.0f + (g - luminance * 255.0f) * (1.0f + amount), 0, 255);
        pixels[i + 2] = (unsigned char)clamp(luminance * 255.0f + (b - luminance * 255.0f) * (1.0f + amount), 0, 255);
        // Preserve alpha
        pixels[i + 3] = pixels[i + 3];
    }
}

EMSCRIPTEN_KEEPALIVE
void adjustSharpnessEffect(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    unsigned char* temp = malloc(numPixels * 4);
    if (!temp) return;
    
    memcpy(temp, pixels, numPixels * 4);
    
    int width = (int)sqrt(numPixels);
    int height = width;
    
    for (int y = 1; y < height - 1; y++) {
        for (int x = 1; x < width - 1; x++) {
            for (int c = 0; c < 3; c++) {
                int idx = (y * width + x) * 4 + c;
                float center = temp[idx];
                float sum = 
                    -0.5f * temp[((y-1) * width + x) * 4 + c] +
                    -0.5f * temp[(y * width + (x-1)) * 4 + c] +
                    3.0f * center +
                    -0.5f * temp[(y * width + (x+1)) * 4 + c] +
                    -0.5f * temp[((y+1) * width + x) * 4 + c];
                
                pixels[idx] = (unsigned char)clamp(center + (sum - center) * amount, 0, 255);
            }
            // Preserve alpha
            int idx = (y * width + x) * 4 + 3;
            pixels[idx] = temp[idx];
        }
    }
    
    free(temp);
}

EMSCRIPTEN_KEEPALIVE
void generateHistogram(unsigned char* pixels, int numPixels, int* histogramR, int* histogramG, int* histogramB) {
    for (int i = 0; i < 256; i++) {
        histogramR[i] = 0;
        histogramG[i] = 0;
        histogramB[i] = 0;
    }
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        histogramR[pixels[i]]++;
        histogramG[pixels[i + 1]]++;
        histogramB[pixels[i + 2]]++;
    }
}

EMSCRIPTEN_KEEPALIVE
void addGrain(unsigned char* pixels, int numPixels, float amount) {
    srand((unsigned int)time(NULL));
    
    for (int i = 0; i < numPixels * 4; i += 4) {
        for (int j = 0; j < 3; j++) {
            double random = (double)rand() / (double)RAND_MAX;
            float noise = (float)(random - 0.5) * amount * 255.0f;
            float value = (float)pixels[i + j] + noise;
            pixels[i + j] = (unsigned char)clamp(value, 0, 255);
        }

    }
}

EMSCRIPTEN_KEEPALIVE
void adjustVignetteEffect(unsigned char* pixels, int numPixels, float amount) {
    if (!pixels) return;
    
    int width = (int)sqrt(numPixels);
    int height = width;
    float centerX = width / 2.0f;
    float centerY = height / 2.0f;
    float maxDist = sqrtf(centerX * centerX + centerY * centerY);
    
    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            float dx = x - centerX;
            float dy = y - centerY;
            float dist = sqrtf(dx * dx + dy * dy) / maxDist;
            float factor = 1.0f - powf(dist, 2.0f) * amount;
            
            int idx = (y * width + x) * 4;
            pixels[idx] = (unsigned char)clamp(pixels[idx] * factor, 0, 255);
            pixels[idx + 1] = (unsigned char)clamp(pixels[idx + 1] * factor, 0, 255);
            pixels[idx + 2] = (unsigned char)clamp(pixels[idx + 2] * factor, 0, 255);
            // Preserve alpha
            pixels[idx + 3] = pixels[idx + 3];
        }
    }
}

int main() {
    return 0;
}

