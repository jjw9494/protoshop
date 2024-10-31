// "use client";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
// import { CustomFileInput } from "./custom-hooks/CustomFileInput";
// import { Slider } from "@/components/ui/slider";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";

// export default function Home() {
// 	const [imageFile, setImageFile] = useState<File | null>(null);
// 	const [brightness, setBrightness] = useState(1); // Initialize brightness state

// 	return (
// 		<>
// 			<main className="md:h-screen h-full w-screen flex flex-col md:flex-row bg-zinc-900 md:overflow-y-hidden">
// 				<div className="flex flex-col w-[100%] md:w-[75%] h-full md:h-screen">
// 					<Nav setImageFile={setImageFile} />
// 					<Separator orientation="horizontal" className="bg-zinc-800 " />
// 					<div className="md:h-[95%] max-h-[60%] md:max-h-[100%] flex items-center justify-center">
// 						{imageFile ? (
// 							<Image
// 								width={0}
// 								height={0}
// 								src={URL.createObjectURL(imageFile)}
// 								sizes="100vw"
// 								style={{
// 									width: "auto",
// 									height: "auto",
// 									filter: `brightness(${brightness})`,
// 								}}
// 								alt="Uploaded"
// 								className="max-w-[90%] h-auto max-h-[90%] mx-auto my-4 md:my-0"
// 							/>
// 						) : (
// 							<div className="w-[50%]">
// 								<CustomFileInput setImageFile={setImageFile}></CustomFileInput>
// 							</div>
// 						)}
// 					</div>
// 				</div>
// 				<Separator orientation="vertical" className="bg-zinc-800" />
// 				<Tools
// 					imageFile={imageFile}
// 					setImageFile={setImageFile}
// 					setBrightness={setBrightness}
// 				/>
// 			</main>
// 		</>
// 	);
// }

// export function Nav({ setImageFile }: { setImageFile: any }) {
// 	return (
// 		<nav className="flex flex-row gap-4 min-h-[7%] items-center pl-8 bg-zinc-950 shadow-[0px_20px_68px_37px_#101012]">
// 			<Image
// 				src="/prototype-logo.png"
// 				width={40}
// 				height={40}
// 				alt="Logo Icon"
// 				className="mr-8"
// 				priority
// 			></Image>
// 			<Button onClick={() => setImageFile(null)}>New</Button>
// 		</nav>
// 	);
// }

// export function Tools({
// 	imageFile,
// 	setImageFile,
// 	setBrightness,
// }: {
// 	imageFile: File | null;
// 	setImageFile: any;
// 	setBrightness: (value: number) => void;
// }) {
// 	const handleBrightnessChange = (value: number[]) => {
// 		setBrightness(value[0] / 50); // Normalize slider value to a range of 0 - 2 for brightness
// 	};

// 	return (
// 		<aside className="w-[100%] md:w-[25%] md:h-screen bg-zinc-950">
// 			<Separator orientation="horizontal" className="bg-zinc-800" />
// 			<div className="w-full h-[93%] flex gap-8 flex-col p-8">
// 				<div className="flex flex-col gap-4">
// 					<label className="text-white">Brightness</label>
// 					<Slider
// 						defaultValue={[50]}
// 						max={100}
// 						step={1}
// 						onValueChange={handleBrightnessChange}
// 					/>
// 				</div>
// 			</div>
// 		</aside>
// 	);
// }
"use client";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CustomFileInput } from "./custom-hooks/CustomFileInput";
import { Slider } from "@/components/ui/slider";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [brightness, setBrightness] = useState(1);
	const [contrast, setContrast] = useState(1);
	const [saturation, setSaturation] = useState(1);

	const [tempBrightness, setTempBrightness] = useState(1);
	const [tempContrast, setTempContrast] = useState(1);
	const [tempSaturation, setTempSaturation] = useState(1);

	return (
		<>
			<main className="md:h-screen h-full w-screen flex flex-col md:flex-row bg-zinc-900 md:overflow-y-hidden">
				<div className="flex flex-col w-[100%] md:w-[75%] h-full md:h-screen">
					<Nav setImageFile={setImageFile} />
					<Separator orientation="horizontal" className="bg-zinc-800 " />
					<div className="md:h-[95%] max-h-[60%] md:max-h-[100%] flex items-center justify-center">
						{imageFile ? (
							<Image
								width={0}
								height={0}
								src={URL.createObjectURL(imageFile)}
								sizes="100vw"
								style={{
									width: "auto",
									height: "auto",
									filter: `brightness(${tempBrightness}) contrast(${tempContrast}) saturate(${tempSaturation})`,
								}}
								alt="Uploaded"
								className="max-w-[90%] h-auto max-h-[90%] mx-auto my-4 md:my-0"
							/>
						) : (
							<div className="w-[50%]">
								<CustomFileInput setImageFile={setImageFile}></CustomFileInput>
							</div>
						)}
					</div>
				</div>
				<Separator orientation="vertical" className="bg-zinc-800" />
				<Tools
					imageFile={imageFile}
					setTempBrightness={setTempBrightness}
					setTempContrast={setTempContrast}
					setTempSaturation={setTempSaturation}
					setBrightness={setBrightness}
					setContrast={setContrast}
					setSaturation={setSaturation}
				/>
			</main>
		</>
	);
}

export function Nav({ setImageFile }: { setImageFile: any }) {
	return (
		<nav className="flex flex-row gap-4 min-h-[7%] items-center pl-8 bg-zinc-950 shadow-[0px_20px_68px_37px_#101012]">
			<Image
				src="/prototype-logo.png"
				width={40}
				height={40}
				alt="Logo Icon"
				className="mr-8"
				priority
			></Image>
			<Button onClick={() => setImageFile(null)}>New</Button>
		</nav>
	);
}

export function Tools({
	imageFile,
	setTempBrightness,
	setTempContrast,
	setTempSaturation,
	setBrightness,
	setContrast,
	setSaturation,
}: {
	imageFile: File | null;
	setTempBrightness: (value: number) => void;
	setTempContrast: (value: number) => void;
	setTempSaturation: (value: number) => void;
	setBrightness: (value: number) => void;
	setContrast: (value: number) => void;
	setSaturation: (value: number) => void;
}) {
	const handleBrightnessChange = useCallback(
		(value: number[]) => {
			setTempBrightness(value[0] / 50); // Normalize to 0 - 2
		},
		[setTempBrightness]
	);

	const handleContrastChange = useCallback(
		(value: number[]) => {
			setTempContrast(value[0] / 50); // Normalize to 0 - 2
		},
		[setTempContrast]
	);

	const handleSaturationChange = useCallback(
		(value: number[]) => {
			setTempSaturation(value[0] / 50); // Normalize to 0 - 2
		},
		[setTempSaturation]
	);

	// Update main states on slider release
	const handleSliderChangeEnd = (
		type: "brightness" | "contrast" | "saturation"
	) => {
		if (type === "brightness") setBrightness(tempBrightness);
		if (type === "contrast") setContrast(tempContrast);
		if (type === "saturation") setSaturation(tempSaturation);
	};

	return (
		<aside className="w-[100%] md:w-[25%] md:h-screen bg-zinc-950">
			<Separator orientation="horizontal" className="bg-zinc-800" />
			<div className="w-full h-[93%] flex gap-8 flex-col p-8">
				<div className="flex flex-col gap-4">
					<label className="text-white">Brightness</label>
					<Slider
						defaultValue={[50]}
						max={100}
						step={1}
						onValueChange={handleBrightnessChange}
						onValueChangeEnd={() => handleSliderChangeEnd("brightness")}
					/>
				</div>
				<div className="flex flex-col gap-4">
					<label className="text-white">Contrast</label>
					<Slider
						defaultValue={[50]}
						max={100}
						step={1}
						onValueChange={handleContrastChange}
						onValueChangeEnd={() => handleSliderChangeEnd("contrast")}
					/>
				</div>
				<div className="flex flex-col gap-4">
					<label className="text-white">Saturation</label>
					<Slider
						defaultValue={[50]}
						max={100}
						step={1}
						onValueChange={handleSaturationChange}
						onValueChangeEnd={() => handleSliderChangeEnd("saturation")}
					/>
				</div>
			</div>
		</aside>
	);
}
