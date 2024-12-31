export interface HistogramData {
	r: number[];
	g: number[];
	b: number[];
}

export interface AdjustmentValues {
	brightness: number;
	exposure: number;
	contrast: number;
	highlight: number;
	shadow: number;
	black: number;
	white: number;
	temperature: number;
	tint: number;
	vibrance: number;
	saturation: number;
	grain: number;
	vignette: number;
	sharpness: number;
}

export interface ToolsProps {
	adjustments: AdjustmentValues;
	setAdjustments: React.Dispatch<React.SetStateAction<AdjustmentValues>>;
	isProcessing: boolean;
	sliderValues: any; // Add proper type if needed
	setSliderValues: React.Dispatch<React.SetStateAction<any>>;
}

export type AdjustmentFunction = (
	imageData: ImageData,
	value: number
) => Promise<ImageData>;