"use client";
import { Separator } from "@/components/ui/separator";
import { CustomFileInput } from "./custom-hooks/CustomFileInput";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
	generateHistogram,
	adjustBlacks,
	adjustBrightness,
	adjustContrast,
	adjustExposure,
	adjustHighlights,
	adjustShadows,
	adjustWhites,
	addGrain,
	adjustTemperature,
	adjustTint,
	adjustVibrance,
	adjustSaturation,
	adjustVignette,
	adjustSharpness,
} from "../wasm_functions/function_wrappers";
import localFont from "next/font/local";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { debounce } from "lodash";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const headerBold = localFont({
	src: "./fonts/PPNeueBit-Bold.otf",
});

interface AdjustmentValues {
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

const defaultAdjustments: AdjustmentValues = {
	brightness: 1,
	exposure: 1,
	contrast: 1,
	highlight: 1,
	shadow: 1,
	black: 1,
	white: 1,
	temperature: 1,
	tint: 1,
	vibrance: 1,
	saturation: 1,
	grain: 0,
	vignette: 0,
	sharpness: 0,
};

interface HistogramData {
	r: number[];
	g: number[];
	b: number[];
}

export default function Home() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [adjustments, setAdjustments] =
		useState<AdjustmentValues>(defaultAdjustments);
	const [isProcessing, setIsProcessing] = useState(false);
	const [histogramData, setHistogramData] = useState<HistogramData | null>(
		null
	);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const originalImageData = useRef<ImageData | null>(null);
	const currentImageData = useRef<ImageData | null>(null);

	useEffect(() => {
		if (imageFile && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			if (!ctx) return;

			const img = document.createElement("img");
			img.onload = async () => {
				canvas.width = img.width;
				canvas.height = img.height;

				ctx.drawImage(img, 0, 0);

				originalImageData.current = ctx.getImageData(
					0,
					0,
					canvas.width,
					canvas.height
				);
				currentImageData.current = ctx.getImageData(
					0,
					0,
					canvas.width,
					canvas.height
				);

				const histogram = await generateHistogram(originalImageData.current);
				setHistogramData(histogram);
			};
			img.src = URL.createObjectURL(imageFile);

			return () => {
				URL.revokeObjectURL(img.src);
			};
		}
	}, [imageFile]);

	type AdjustmentFunction = (imageData: ImageData, value: number) => Promise<ImageData>;

	const processAdjustment = async (
		adjustmentFn: AdjustmentFunction, 
		value: number,
		imageData: ImageData
	) => {
		if (value === 1) return imageData;
		return await adjustmentFn(imageData, value);
	};

	const applyAdjustments = async (newAdjustments: AdjustmentValues) => {
		if (!canvasRef.current || !originalImageData.current || isProcessing)
			return;

		const ctx = canvasRef.current.getContext("2d", {
			willReadFrequently: true,
		});
		if (!ctx) return;

		setIsProcessing(true);

		try {
			let processedData = originalImageData.current;

			if (newAdjustments.brightness !== 1) {
				processedData = await processAdjustment(
					adjustBrightness,
					newAdjustments.brightness,
					processedData
				);
			}
			if (newAdjustments.exposure !== 1) {
				processedData = await processAdjustment(
					adjustExposure,
					newAdjustments.exposure,
					processedData
				);
			}
			if (newAdjustments.contrast !== 1) {
				processedData = await processAdjustment(
					adjustContrast,
					newAdjustments.contrast,
					processedData
				);
			}
			if (newAdjustments.highlight !== 1) {
				processedData = await processAdjustment(
					adjustHighlights,
					newAdjustments.highlight,
					processedData
				);
			}
			if (newAdjustments.shadow !== 1) {
				processedData = await processAdjustment(
					adjustShadows,
					newAdjustments.shadow,
					processedData
				);
			}
			if (newAdjustments.black !== 1) {
				processedData = await processAdjustment(
					adjustBlacks,
					newAdjustments.black,
					processedData
				);
			}
			if (newAdjustments.white !== 1) {
				processedData = await processAdjustment(
					adjustWhites,
					newAdjustments.white,
					processedData
				);
			}
			if (newAdjustments.grain !== 1) {
				processedData = await processAdjustment(
					addGrain,
					newAdjustments.grain,
					processedData
				);
			}
			if (newAdjustments.temperature !== 1) {
				processedData = await processAdjustment(
					adjustTemperature,
					newAdjustments.temperature,
					processedData
				);
			}
			if (newAdjustments.tint !== 1) {
				processedData = await processAdjustment(
					adjustTint,
					newAdjustments.tint,
					processedData
				);
			}
			if (newAdjustments.vibrance !== 1) {
				processedData = await processAdjustment(
					adjustVibrance,
					newAdjustments.vibrance,
					processedData
				);
			}
			if (newAdjustments.saturation !== 1) {
				processedData = await processAdjustment(
					adjustSaturation,
					newAdjustments.saturation,
					processedData
				);
			}
			if (newAdjustments.vignette !== 1) {
				processedData = await processAdjustment(
					adjustVignette,
					newAdjustments.vignette,
					processedData
				);
			}
			if (newAdjustments.sharpness !== 1) {
				processedData = await processAdjustment(
					adjustSharpness,
					newAdjustments.sharpness,
					processedData
				);
			}

			currentImageData.current = processedData;
			ctx.putImageData(processedData, 0, 0);

			const newHistogram = await generateHistogram(processedData);
			setHistogramData(newHistogram);
		} catch (error) {
			console.error("Error processing image:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	// Originally tried debouncing for smoother sliders but not sure whether it's better, trying without...
	// const debouncedApplyAdjustments = useMemo(
	// 	() => debounce(applyAdjustments, 50),
	// 	[]
	// );

	useEffect(() => {
		if (imageFile) {
			// debouncedApplyAdjustments(adjustments);
			applyAdjustments(adjustments)
		}
		// return () => {
		// 	debouncedApplyAdjustments.cancel();
		// };
	}, [adjustments, imageFile]);

	const handleDownload = () => {
		if (!canvasRef.current) return;

		const link = document.createElement("a");
		link.download = "edited-image.png";
		link.href = canvasRef.current.toDataURL();
		link.click();
	};

	return (
		<main className="md:h-screen h-full w-screen flex flex-col md:flex-row bg-zinc-900 md:overflow-y-hidden">
			<div className="flex flex-col w-[100%] md:w-[80%] h-full md:h-screen">
				<Nav setImageFile={setImageFile} handleDownload={handleDownload} />
				<Separator orientation="horizontal" className="bg-zinc-800" />
				<div className="md:h-[99%] max-h-[60%] md:max-h-[100%] flex flex-col items-center justify-center gap-4">
					{imageFile ? (
						<>
							<canvas
								ref={canvasRef}
								className="max-w-[75%] h-auto max-h-[75%] mx-auto md:my-0"
							/>
							{histogramData && (
								<div className="w-full max-w-[90%] h-32 bg-zinc-950 rounded-lg p-2">
									<ResponsiveContainer width="95%">
										<LineChart
											margin={{ top: 5, right: 5, left: 50, bottom: 5 }}
											height={400}
											data={Array.from({ length: 256 }, (_, i) => ({
												value: i,
												r: histogramData.r[i],
												g: histogramData.g[i],
												b: histogramData.b[i],
											}))}
										>
											<XAxis dataKey="value" hide />
											<YAxis hide />
											<Line
												type="monotone"
												dataKey="r"
												stroke="#ff0000"
												dot={false}
											/>
											<Line
												type="monotone"
												dataKey="g"
												stroke="#00ff00"
												dot={false}
											/>
											<Line
												type="monotone"
												dataKey="b"
												stroke="#0000ff"
												dot={false}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							)}
						</>
					) : (
						<div className="w-[50%] flex flex-col justify-center items-center gap-4">
							<CustomFileInput setImageFile={setImageFile} />
						</div>
					)}
				</div>
			</div>
			<Separator orientation="vertical" className="bg-zinc-800" />
			<Tools
				adjustments={adjustments}
				setAdjustments={setAdjustments}
				isProcessing={isProcessing}
			/>
		</main>
	);
}

function Nav({
	setImageFile,
	handleDownload,
}: {
	setImageFile: (value: File | null) => void;
	handleDownload: () => void;
}) {
	return (
		<nav className="flex flex-row gap-4 min-h-[4%] items-center pl-8 bg-zinc-950 shadow-[0px_20px_68px_37px_#101012]">
			<Image
				src="/prototype-logo.png"
				width={30}
				height={30}
				alt="Logo Icon"
				className="mr-8"
				priority
			></Image>
			<Menubar className="bg-zinc-950 border-none text-white active:bg-zinc-200">
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent className="bg-zinc-950 border-none text-white">
						<MenubarItem onClick={() => setImageFile(null)}>
							New File
						</MenubarItem>
						<MenubarSeparator className="bg-zinc-800" />
						<MenubarItem onClick={handleDownload}>Download</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>Account</MenubarTrigger>
					<MenubarContent className="bg-zinc-950 border-none text-white">
						<MenubarItem>Coming Soon...</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</nav>
	);
}

interface ToolsProps {
	adjustments: AdjustmentValues;
	setAdjustments: React.Dispatch<React.SetStateAction<AdjustmentValues>>;
	isProcessing: boolean;
}

function Tools({ setAdjustments, isProcessing }: ToolsProps) {
	const [sliderValues, setSliderValues] = useState({
		brightness: 50,
		exposure: 50,
		contrast: 50,
		highlight: 50,
		shadow: 50,
		black: 50,
		white: 50,
		temperature: 50,
		tint: 50,
		vibrance: 50,
		saturation: 50,
		grain: 0,
		vignette: 0,
		sharpness: 0,
	});

	const handleSliderChange = (
		name: keyof AdjustmentValues,
		value: number[]
	) => {
		const newValue = value[0];
		console.log(name + ": " + newValue);
		setSliderValues((prev) => ({ ...prev, [name]: newValue }));

		let adjustmentValue: number;
		switch (name) {
			case "temperature":
			case "tint":
				// Temperature and tint range: -2 to 2
				adjustmentValue = (newValue - 50) / 25;
				break;
			case "vibrance":
			case "saturation":
				// Vibrance and saturation range: 0 to 2
				adjustmentValue = newValue / 50;
				break;
			case "exposure":
				// Reduced range for exposure: -1 to 1
				adjustmentValue = (newValue / 50 - 1) * 1;
				break;
			case "brightness":
				// Brightness range: 0 to 2
				adjustmentValue = newValue / 50;
				break;
			case "contrast":
				// Contrast range: 0.5 to 1.5
				adjustmentValue = newValue / 50;
				break;
			case "shadow":
			case "black":
				// Shadows and blacks range: -0.5 to 0.5
				adjustmentValue = (newValue - 50) / 100;
				break;
			case "highlight":
			case "white":
				// Highlights and whites range: -0.5 to 0.5
				adjustmentValue = (newValue - 50) / 100;
				break;
			case "grain":
			case "vignette":
			case "sharpness":
				// Effects range: 0 to 1
				adjustmentValue = newValue / 100;
				break;
			default:
				adjustmentValue = newValue / 50;
		}

		setAdjustments((prev) => ({
			...prev,
			[name]: adjustmentValue,
		}));
	};

	return (
		<aside className="w-[100%] md:w-[20%] md:h-screen bg-zinc-950">
			<Separator orientation="horizontal" className="bg-zinc-800" />
			<ScrollArea className="h-full">
				<Tabs defaultValue="dark" className="w-full bg-zinc-950">
					<TabsList className="w-full bg-zinc-950">
						<TabsTrigger value="light">Light</TabsTrigger>
						<TabsTrigger value="color">Color</TabsTrigger>
						<TabsTrigger value="effects">Effects</TabsTrigger>
					</TabsList>
					<TabsContent value="light" className="p-4">
						{[
							{ name: "exposure", label: "Exposure" },
							{ name: "brightness", label: "Brightness" },
							{ name: "contrast", label: "Contrast" },
							{ name: "highlight", label: "Highlights" },
							{ name: "shadow", label: "Shadows" },
							{ name: "black", label: "Blacks" },
							{ name: "white", label: "Whites" },
						].map(({ name, label }) => (
							<SliderControl
								key={name}
								name={name as keyof AdjustmentValues}
								label={label}
								value={sliderValues[name as keyof typeof sliderValues]}
								onChange={handleSliderChange}
								disabled={isProcessing}
							/>
						))}
					</TabsContent>
					<TabsContent value="color" className="p-4">
						{[
							{ name: "temperature", label: "Temperature" },
							{ name: "tint", label: "Tint" },
							{ name: "vibrance", label: "Vibrance" },
							{ name: "saturation", label: "Saturation" },
						].map(({ name, label }) => (
							<SliderControl
								key={name}
								name={name as keyof AdjustmentValues}
								label={label}
								value={sliderValues[name as keyof typeof sliderValues]}
								onChange={handleSliderChange}
								disabled={isProcessing}
							/>
						))}
					</TabsContent>
					<TabsContent value="effects" className="p-4">
						{[
							{ name: "sharpness", label: "Sharpness" },
							{ name: "grain", label: "Grain" },
							{ name: "vignette", label: "Vignette" },
						].map(({ name, label }) => (
							<SliderControl
								key={name}
								name={name as keyof AdjustmentValues}
								label={label}
								value={sliderValues[name as keyof typeof sliderValues]}
								onChange={handleSliderChange}
								disabled={isProcessing}
							/>
						))}
					</TabsContent>
				</Tabs>
			</ScrollArea>
		</aside>
	);
}

interface SliderControlProps {
	name: keyof AdjustmentValues;
	label: string;
	value: number;
	onChange: (name: keyof AdjustmentValues, value: number[]) => void;
	disabled: boolean;
}

function SliderControl({
	name,
	label,
	value,
	onChange,
	disabled,
}: SliderControlProps) {
	return (
		<div className="flex flex-col gap-4 mb-8">
			<div className="flex flex-row justify-between">
				<label className={`${headerBold.className} text-2xl text-white`}>
					{label}
				</label>
				<p className={`${headerBold.className} text-2xl text-white`}>
					{name === "grain" || name === "vignette" || name === "sharpness"
						? Math.round(value)
						: name === "temperature" || name === "tint"
						? value - 50
						: ((value * 2 - 100) / 100).toFixed(2)}
				</p>
			</div>
			<Slider
				defaultValue={[50]}
				min={0}
				max={100}
				step={1}
				value={[value]}
				onValueChange={(e) => onChange(name, e)}
				disabled={disabled}
			/>
		</div>
	);
}
