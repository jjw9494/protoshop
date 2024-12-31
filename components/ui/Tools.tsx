import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./separator";
import localFont from "next/font/local";
import { ToolsProps, AdjustmentValues } from "@/interfaces/HomeInterfaces";

const headerBold = localFont({
	src: "../../public/fonts/PPNeueBit-Bold.otf",
});

export default function Tools({
	setAdjustments,
	isProcessing,
	sliderValues,
	setSliderValues,
}: ToolsProps) {
	const handleSliderChange = (
		name: keyof AdjustmentValues,
		value: number[]
	) => {
		const newValue = value[0];
		console.log(name + ": " + newValue);
		setSliderValues((prev: any) => ({ ...prev, [name]: newValue }));

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

		setAdjustments((prev: any) => ({
			...prev,
			[name]: adjustmentValue,
		}));
	};

	return (
		<aside className="w-[100%] md:w-[20%] md:h-screen bg-zinc-950">
			<Separator orientation="horizontal" className="bg-zinc-800" />
			<ScrollArea className="h-full">
				<Tabs defaultValue="light" className="w-full bg-zinc-950">
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
