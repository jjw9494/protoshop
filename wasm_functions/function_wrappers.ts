// function_wrappers.ts
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

// Generic function to handle image processing
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

// Export individual adjustment functions
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

// Helper function to apply multiple adjustments at once for better performance
export async function applyMultipleAdjustments(
	imageData: ImageData,
	adjustments: {
		brightness?: number;
		exposure?: number;
		contrast?: number;
		highlights?: number;
		shadows?: number;
		whites?: number;
		blacks?: number;
	}
): Promise<ImageData> {
	let result = imageData;

	if (adjustments.exposure !== undefined) {
		result = await adjustExposure(result, adjustments.exposure);
	}
	if (adjustments.contrast !== undefined) {
		result = await adjustContrast(result, adjustments.contrast);
	}
	if (adjustments.highlights !== undefined) {
		result = await adjustHighlights(result, adjustments.highlights);
	}
	if (adjustments.shadows !== undefined) {
		result = await adjustShadows(result, adjustments.shadows);
	}
	if (adjustments.whites !== undefined) {
		result = await adjustWhites(result, adjustments.whites);
	}
	if (adjustments.blacks !== undefined) {
		result = await adjustBlacks(result, adjustments.blacks);
	}
	if (adjustments.brightness !== undefined) {
		result = await adjustBrightness(result, adjustments.brightness);
	}

	return result;
}
