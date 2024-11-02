interface EmscriptenModuleWithCCall {
	ccall: (
		funcName: string,
		returnType: string,
		argTypes: string[],
		args: any[]
	) => any;
	cwrap: (funcName: string, returnType: string, argTypes: string[]) => any;
	HEAPU8: Uint8Array;
	_EMSCRIPTEN_MALLOC: (size: number) => number;
	_EMSCRIPTEN_FREE: (ptr: number) => void;
}

let moduleInstance: Promise<EmscriptenModuleWithCCall>;

async function loadModule(): Promise<EmscriptenModuleWithCCall> {
	if (!moduleInstance) {
		moduleInstance = (async () => {
			const Module = (await import("./editing_functions.js")).default;
			return await Module();
		})();
	}
	return moduleInstance;
}

async function processImage(
	imageData: ImageData,
	functionName: string,
	amount: number
): Promise<ImageData> {
	const module = await loadModule();

	const numPixels = imageData.width * imageData.height;
	const byteSize = numPixels * 4;
	const ptr = module._EMSCRIPTEN_MALLOC(byteSize);

	if (!ptr) {
		throw new Error("Failed to allocate memory");
	}

	try {
		module.HEAPU8.set(new Uint8Array(imageData.data.buffer), ptr);

		module.ccall(
			functionName,
			"void",
			["number", "number", "number"],
			[ptr, numPixels, amount]
		);

		const resultData = new Uint8Array(byteSize);
		resultData.set(module.HEAPU8.subarray(ptr, ptr + byteSize));

		return new ImageData(
			new Uint8ClampedArray(resultData.buffer),
			imageData.width,
			imageData.height
		);
	} finally {
		module._EMSCRIPTEN_FREE(ptr);
	}
}

export async function adjustBrightness(
	imageData: ImageData,
	amount: number
): Promise<ImageData> {
	return processImage(imageData, "adjustBrightness", amount);
}

export async function adjustExposure(
	imageData: ImageData,
	amount: number
): Promise<ImageData> {
	return processImage(imageData, "adjustExposureEffect", amount);
}

export async function adjustContrast(
	imageData: ImageData,
	amount: number
): Promise<ImageData> {
	return processImage(imageData, "adjustContrastEffect", amount);
}

export async function adjustHighlights(
	imageData: ImageData,
	amount: number
): Promise<ImageData> {
	return processImage(imageData, "adjustHighlights", amount);
}

export async function adjustShadows(
	imageData: ImageData,
	amount: number
): Promise<ImageData> {
	return processImage(imageData, "adjustShadows", amount);
}

export async function adjustWhites(
	imageData: ImageData,
	amount: number
): Promise<ImageData> {
	return processImage(imageData, "adjustWhites", amount);
}

export async function adjustBlacks(
	imageData: ImageData,
	amount: number
): Promise<ImageData> {
	return processImage(imageData, "adjustBlacks", amount);
}

export async function adjustTemperature(
    imageData: ImageData,
    amount: number
): Promise<ImageData> {
    return processImage(imageData, "adjustTemperatureEffect", amount);
}

export async function adjustTint(
    imageData: ImageData,
    amount: number
): Promise<ImageData> {
    return processImage(imageData, "adjustTintEffect", amount);
}

export async function adjustVibrance(
    imageData: ImageData,
    amount: number
): Promise<ImageData> {
    return processImage(imageData, "adjustVibranceEffect", amount);
}

export async function adjustSaturation(
    imageData: ImageData,
    amount: number
): Promise<ImageData> {
    return processImage(imageData, "adjustSaturationEffect", amount);
}

export async function adjustSharpness(
    imageData: ImageData,
    amount: number
): Promise<ImageData> {
    return processImage(imageData, "adjustSharpnessEffect", amount);
}

export async function adjustVignette(
    imageData: ImageData,
    amount: number
): Promise<ImageData> {
    return processImage(imageData, "adjustVignetteEffect", amount);
}

export async function addGrain(
	imageData: ImageData,
	amount: number
): Promise<ImageData> {
	return processImage(imageData, "addGrain", amount);
}

export async function generateHistogram(
	imageData: ImageData
): Promise<{ r: number[]; g: number[]; b: number[] }> {
	const module = await loadModule();

	const numPixels = imageData.width * imageData.height;
	const byteSize = numPixels * 4;

	// Allocate memory for the image data and histogram arrays
	const imagePtr = module._EMSCRIPTEN_MALLOC(byteSize);
	const histRPtr = module._EMSCRIPTEN_MALLOC(256 * 4);
	const histGPtr = module._EMSCRIPTEN_MALLOC(256 * 4);
	const histBPtr = module._EMSCRIPTEN_MALLOC(256 * 4);

	try {
		// Copy image data to WASM memory
		module.HEAPU8.set(new Uint8Array(imageData.data.buffer), imagePtr);

		// Call the C function
		module.ccall(
			"generateHistogram",
			"void",
			["number", "number", "number", "number", "number"],
			[imagePtr, numPixels, histRPtr, histGPtr, histBPtr]
		);

		// Create arrays to store the histogram data
		const histR = Array.from(
			new Int32Array(module.HEAPU8.buffer, histRPtr, 256)
		);
		const histG = Array.from(
			new Int32Array(module.HEAPU8.buffer, histGPtr, 256)
		);
		const histB = Array.from(
			new Int32Array(module.HEAPU8.buffer, histBPtr, 256)
		);

		return { r: histR, g: histG, b: histB };
	} finally {
		// Free allocated memory
		module._EMSCRIPTEN_FREE(imagePtr);
		module._EMSCRIPTEN_FREE(histRPtr);
		module._EMSCRIPTEN_FREE(histGPtr);
		module._EMSCRIPTEN_FREE(histBPtr);
	}
}