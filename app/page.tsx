// page.tsx
"use client";
import { Separator } from "@/components/ui/separator";
import { CustomFileInput } from "./custom-hooks/CustomFileInput";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
	adjustBlacks,
	adjustBrightness,
	adjustContrast,
	adjustExposure,
	adjustHighlights,
	adjustShadows,
	adjustWhites,
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
}

const defaultAdjustments: AdjustmentValues = {
	brightness: 1,
	exposure: 1,
	contrast: 1,
	highlight: 1,
	shadow: 1,
	black: 1,
	white: 1,
};

export default function Home() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [adjustments, setAdjustments] =
		useState<AdjustmentValues>(defaultAdjustments);
	const [isProcessing, setIsProcessing] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const originalImageData = useRef<ImageData | null>(null);
	const currentImageData = useRef<ImageData | null>(null);
	const pendingAdjustments = useRef<AdjustmentValues>(defaultAdjustments);

	useEffect(() => {
		if (imageFile && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const img = document.createElement("img");
			img.onload = () => {
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
			};
			img.src = URL.createObjectURL(imageFile);

			return () => {
				URL.revokeObjectURL(img.src);
			};
		}
	}, [imageFile]);

	const processAdjustment = async (
		adjustmentFn: Function,
		value: number,
		imageData: ImageData
	) => {
		if (value === 1) return imageData; 
		return await adjustmentFn(imageData, value);
	};

	const applyAdjustments = async (newAdjustments: AdjustmentValues) => {
		if (!canvasRef.current || !originalImageData.current || isProcessing)
			return;

		const ctx = canvasRef.current.getContext("2d");
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

			currentImageData.current = processedData;
			ctx.putImageData(processedData, 0, 0);
		} catch (error) {
			console.error("Error processing image:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	
	const debouncedApplyAdjustments = useMemo(
		() => debounce(applyAdjustments, 50),
		[]
	);

	useEffect(() => {
		if (imageFile) {
			debouncedApplyAdjustments(adjustments);
		}
		return () => {
			debouncedApplyAdjustments.cancel();
		};
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
				<div className="md:h-[99%] max-h-[60%] md:max-h-[100%] flex items-center justify-center">
					{imageFile ? (
						<>
							<canvas
								ref={canvasRef}
								className="max-w-[90%] h-auto max-h-[90%] mx-auto md:my-0"
							/>
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

function Tools({ adjustments, setAdjustments, isProcessing }: ToolsProps) {
	const [sliderValues, setSliderValues] = useState({
		brightness: 50,
		exposure: 50,
		contrast: 50,
		highlight: 50,
		shadow: 50,
		black: 50,
		white: 50,
	});

	const handleSliderChange = (
		name: keyof AdjustmentValues,
		value: number[]
	) => {
		const newValue = value[0];
		setSliderValues((prev) => ({ ...prev, [name]: newValue }));

		let adjustmentValue: number;

		// Values for slider are wrong, need to sort, some should start at 0 I think
		switch (name) {
			case "brightness":
			case "exposure":
				adjustmentValue = newValue / 50; // Range: 0.5 to 2
				break;
			case "contrast":
			case "highlight":
				adjustmentValue = newValue / 50; // Range: 0 to 2
				break;
			case "shadow":
			case "black":
			case "white":
				adjustmentValue = (newValue - 50) / 50; // Range: -1 to 1
				break;
			default:
				adjustmentValue = newValue / 50; // Fallback
		}

		setAdjustments((prev) => ({
			...prev,
			[name]: adjustmentValue,
		}));
	};

	return (
		<aside className="w-[100%] md:w-[20%] md:h-screen bg-zinc-950">
			<Separator orientation="horizontal" className="bg-zinc-800" />
			<div className="w-full h-[93%] flex gap-8 flex-col p-8">
				{[
					{ name: "brightness", label: "Brightness" },
					{ name: "exposure", label: "Exposure" },
					{ name: "contrast", label: "Contrast" },
					{ name: "highlight", label: "Highlights" },
					{ name: "shadow", label: "Shadows" },
					{ name: "black", label: "Blacks" },
					{ name: "white", label: "Whites" },
				].map(({ name, label }) => (
					<div key={name} className="flex flex-col gap-4">
						<div className="flex flex-row justify-between">
							<label className={`${headerBold.className} text-2xl text-white`}>
								{label}
							</label>
							<p className={`${headerBold.className} text-2xl text-white`}>
								{name === "shadow" || name === "black" || name === "white"
									? sliderValues[name as keyof typeof sliderValues] - 50
									: (sliderValues[name as keyof typeof sliderValues] * 2 -
											100) /
									  100}
							</p>
						</div>
						<Slider
							defaultValue={[50]}
							max={100}
							step={1}
							value={[sliderValues[name as keyof typeof sliderValues]]}
							onValueChange={(e) =>
								handleSliderChange(name as keyof AdjustmentValues, e)
							}
							disabled={isProcessing}
						/>
					</div>
				))}
			</div>
		</aside>
	);
}