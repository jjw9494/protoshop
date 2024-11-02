"use client";
import { Separator } from "@/components/ui/separator";
import { CustomFileInput } from "./custom-hooks/CustomFileInput";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { adjustImageBrightness } from "../wasm_functions/brightness/brightnessWrapper";
import localFont from "next/font/local";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@/components/ui/menubar";

const headerBold = localFont({
	src: "./fonts/PPNeueBit-Bold.otf",
});

export default function Home() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [brightness, setBrightness] = useState(1);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const originalImageData = useRef<ImageData | null>(null);

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

				updateBrightness(brightness);
			};
			img.src = URL.createObjectURL(imageFile);

			return () => {
				URL.revokeObjectURL(img.src);
			};
		}
	}, [imageFile]);

	const updateBrightness = async (value: number) => {
		if (!canvasRef.current || !originalImageData.current) return;

		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;

		try {
			const processedImageData = await adjustImageBrightness(
				originalImageData.current,
				value
			);
			ctx.putImageData(processedImageData, 0, 0);
		} catch (error) {
			console.error("Error processing image:", error);
		}
	};

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
				setBrightness={setBrightness}
				updateBrightness={updateBrightness}
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

function Tools({
	setBrightness,
	updateBrightness,
}: {
	setBrightness: (value: number) => void;
	updateBrightness: (value: number) => void;
}) {
	const handleBrightnessChange = (value: number[]) => {
		const newBrightness = value[0] / 50;
		setBrightness(newBrightness);
		updateBrightness(newBrightness);
	};
	const [brightnessVal, setBrightnessVal] = useState<number>(50);
	const [contrastVal, setContrastVal] = useState<number>(50);
	const [saturationVal, setSaturationVal] = useState<number>(50);

	function handleBrightness(e: React.ChangeEvent<HTMLInputElement>) {
		const value = Number(e);
		setBrightnessVal(value);
		handleBrightnessChange([value]);
	}

	function handleContrast(e: React.ChangeEvent<HTMLInputElement>) {
		setContrastVal(Number(e.target.value));
	}

	function handleSaturation(e: React.ChangeEvent<HTMLInputElement>) {
		setSaturationVal(Number(e.target.value));
	}

	return (
		<aside className="w-[100%] md:w-[20%] md:h-screen bg-zinc-950">
			<Separator orientation="horizontal" className="bg-zinc-800" />
			<div className="w-full h-[93%] flex gap-8 flex-col p-8">
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between mt-4">
						<label className={`${headerBold.className} text-2xl text-white`}>
							Brightness
						</label>
						<p className={`${headerBold.className} text-2xl text-white`}>
							{brightnessVal}
						</p>
					</div>

					<Slider
						defaultValue={[50]}
						max={100}
						step={1}
						onValueChange={(e) => handleBrightness(e)}
					/>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between">
						<label className={`${headerBold.className} text-2xl text-white`}>
							Contrast
						</label>
						<p className={`${headerBold.className} text-2xl text-white`}>
							{contrastVal}
						</p>
					</div>

					<Slider
						defaultValue={[50]}
						max={100}
						step={1}
						onValueChange={(e) => handleContrast(e)}
					/>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between">
						<label className={`${headerBold.className} text-2xl text-white`}>
							Saturation
						</label>
						<p className={`${headerBold.className} text-2xl text-white`}>
							{saturationVal}
						</p>
					</div>

					<Slider
						defaultValue={[50]}
						max={100}
						step={1}
						onValueChange={(e) => handleSaturation(e)}
					/>
				</div>
			</div>
		</aside>
	);
}
