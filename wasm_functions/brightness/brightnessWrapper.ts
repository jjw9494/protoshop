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
			const Module = (await import("./brightness.js")).default;
			return await Module();
		})();
	}
	return moduleInstance;
}

export async function adjustImageBrightness(
	imageData: ImageData,
	brightness: number
): Promise<ImageData> {
	const module = await loadModule();

	// Allocate memory for the pixel data
	const numPixels = imageData.width * imageData.height;
	const byteSize = numPixels * 4; // 4 bytes per pixel (RGBA)
	const ptr = module._EMSCRIPTEN_MALLOC(byteSize);

	if (!ptr) {
		throw new Error("Failed to allocate memory");
	}

	try {
		// Copy image data to WASM memory
		module.HEAPU8.set(new Uint8Array(imageData.data.buffer), ptr);

		// Call the C function
		module.ccall(
			"adjustBrightness",
			"void",
			["number", "number", "number"],
			[ptr, numPixels, brightness]
		);

		// Copy the result back
		const resultData = new Uint8Array(byteSize);
		resultData.set(module.HEAPU8.subarray(ptr, ptr + byteSize));

		// Create new ImageData with the processed pixels
		return new ImageData(
			new Uint8ClampedArray(resultData.buffer),
			imageData.width,
			imageData.height
		);
	} finally {
		// Always free the allocated memory
		module._EMSCRIPTEN_FREE(ptr);
	}
}
