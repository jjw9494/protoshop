"use client";
import { Separator } from "@/components/ui/separator";
import { CustomFileInput } from "./custom-hooks/CustomFileInput";
import { useState, useRef, useEffect, useMemo } from "react";
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
import { debounce } from "lodash";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
	generateAccessToken,
	getFileContent,
} from "@/services/protoshopServices";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPortal,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { addFile, addS3File } from "@/services/protoshopServices";
import { toast } from "sonner";
import Nav from "@/components/ui/Nav";
import {
	AdjustmentValues,
	HistogramData,
	AdjustmentFunction,
} from "@/interfaces/HomeInterfaces";
import Tools from "@/components/ui/Tools";
import SaveMenu from "@/components/ui/SaveMenu";
import OpenMenu from "@/components/ui/OpenMenu";

const headerBold = localFont({
	src: "../public/fonts/PPNeueBit-Bold.otf",
});

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

const defaultSliderValues: AdjustmentValues = {
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
};

export default function Home() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState<string>();

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [adjustments, setAdjustments] =
		useState<AdjustmentValues>(defaultAdjustments);
	const [sliderValues, setSliderValues] = useState(defaultSliderValues);
	const [isProcessing, setIsProcessing] = useState(false);
	const [histogramData, setHistogramData] = useState<HistogramData | null>(
		null
	);

	const [explorerData, setExplorerData] = useState<any>();

	const [openItemDestination, setOpenItemDestination] = useState();
	const [openMenuOpen, setOpenMenuOpen] = useState(false);

	const [saveMenuOpen, setSaveMenuOpen] = useState(false);
	const [saveItemDestination, setSaveItemDestination] = useState();
	const [saveItemTextInput, setSaveItemTextInput] = useState();
	const searchParams = useSearchParams();

	// Login and get user information
	useEffect(() => {
		const authCode = searchParams.get("code");
		const getData = async () => {
			const response = await generateAccessToken(authCode);
			if (response) {
				console.log(response);
				setLoggedIn(true);
				setUsername(response.username);
				setExplorerData(response.directory[0]);
			}
		};
		getData();
	}, [searchParams]);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const originalImageData = useRef<ImageData | null>(null);
	const currentImageData = useRef<ImageData | null>(null);

	useEffect(() => {});

	// Create Image component and apply histogram function
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

	const processAdjustment = async (
		adjustmentFn: AdjustmentFunction,
		value: number,
		imageData: ImageData
	) => {
		if (value === 1) return imageData;
		return await adjustmentFn(imageData, value);
	};

	// Apply image filtering effects and update histogram
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

	// Debounce adjustment function to limit processing rate
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

		const fileInfo = explorerData?.objChildren?.find(
			(child: any) => child.objId === openItemDestination
		);

		const link = document.createElement("a");
		link.download = fileInfo.name;
		link.href = canvasRef.current.toDataURL();
		link.click();
	};

	const handleClearFile = () => {
		setImageFile(null);
		setAdjustments(defaultAdjustments);
		setSliderValues({
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
	};

	const handleSaveFile = async () => {
		// First check if we have an open file
		if (!canvasRef.current || !openItemDestination) {
			toast("Error", {
				description: "No file is currently open for saving",
			});
			return;
		}

		try {
			// Find the current file info from explorer data
			const fileInfo = explorerData?.objChildren?.find(
				(child: any) => child.objId === openItemDestination
			);

			if (!fileInfo) {
				throw new Error("Cannot find current file information");
			}

			// Get the file extension
			const fileExtension = getFileExtension(imageFile);

			// Convert canvas to File object
			const fileToUpload = await canvasToFile(
				canvasRef.current,
				fileInfo.name,
				fileExtension
			);

			// Create form data for upload
			const formData = new FormData();
			formData.append("FileId", openItemDestination);
			formData.append("FileContent", fileToUpload);

			// Upload the file content
			await addS3File(formData);

			toast("Success", {
				description: "File saved successfully",
			});
		} catch (error) {
			console.error("Error saving file:", error);
			toast("Error", {
				description: "Failed to save file",
			});
		}
	};

	const handleOpenFile = async () => {
		if (!openItemDestination) {
			toast("Error", {
				description: "Please select a file to open",
			});
			return;
		}

		try {
			// Get the file blob using the new endpoint
			const fileBlob = await getFileContent(openItemDestination);

			if (!fileBlob) {
				throw new Error("Failed to get file");
			}

			// Create a File object from the blob
			const fileInfo = explorerData?.objChildren?.find(
				(child: any) => child.objId === openItemDestination
			);
			const filename = fileInfo?.name || "opened-file.png";

			const file = new File([fileBlob], filename, { type: fileBlob.type });

			// Reset all adjustments to default values
			setAdjustments(defaultAdjustments);
			setSliderValues({
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

			// Set the new image file
			setImageFile(file);

			toast("Success", {
				description: "File opened successfully",
			});
		} catch (error) {
			console.error("Error opening file:", error);
			toast("Error", {
				description: "Failed to open file",
			});
		} finally {
			setOpenMenuOpen(false);
		}
	};

	const getFileExtension = (file: File | null): string => {
		if (!file) return "png"; // Default to png if no original file
		const filename = file.name;
		const ext = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
		return ext.toLowerCase();
	};

	const canvasToFile = async (
		canvas: HTMLCanvasElement,
		filename: string,
		type: string
	): Promise<File> => {
		return new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (blob) {
					const file = new File([blob], filename, { type: `image/${type}` });
					resolve(file);
				} else {
					reject(new Error("Failed to convert canvas to blob"));
				}
			}, `image/${type}`);
		});
	};

	const handleSaveNewFile = async () => {
		if (!canvasRef.current || !saveItemTextInput || !saveItemDestination) {
			toast("Error", {
				description: "Missing required information for saving",
			});
			return;
		}

		try {
			// Generate UUID for the new file
			const uuid = uuidv4();

			// Get the file extension from the original file or default to png
			const fileExtension = getFileExtension(imageFile);

			// Create the full filename with extension
			const fullFilename = `${saveItemTextInput}.${fileExtension}`;

			// Convert canvas to File object
			const fileToUpload = await canvasToFile(
				canvasRef.current,
				fullFilename,
				fileExtension
			);

			// First, create the file entry in your system
			const response = await addFile(uuid, fullFilename, saveItemDestination);

			if (response) {
				// If file entry is created, upload the actual file content
				const formData = new FormData();
				formData.append("FileId", uuid);
				formData.append("FileContent", fileToUpload);

				await addS3File(formData);

				// Update explorer data with the new file
				setExplorerData(response.directory[0]);

				toast("Success", {
					description: "File saved successfully",
				});
			} else {
				throw new Error("Failed to save file");
			}
		} catch (error) {
			console.error("Error saving file:", error);
			toast("Error", {
				description: "Failed to save file",
			});
		} finally {
			setSaveMenuOpen(false);
		}
	};

	return (
		<main className="md:h-screen h-full w-screen flex flex-col md:flex-row bg-zinc-900 md:overflow-y-hidden">
			<div className="flex flex-col w-[100%] md:w-[80%] h-full md:h-screen">
				<Nav
					setImageFile={setImageFile}
					handleDownload={handleDownload}
					loggedIn={loggedIn}
					username={username}
					setSaveMenuOpen={setSaveMenuOpen}
					setOpenMenuOpen={setOpenMenuOpen}
					handleSaveFile={handleSaveFile}
					handleClearFile={handleClearFile}
				/>
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
				sliderValues={sliderValues}
				setSliderValues={setSliderValues}
			/>
			{saveMenuOpen && (
				<Dialog open={saveMenuOpen} onOpenChange={setSaveMenuOpen}>
					<DialogPortal>
						<DialogContent
							className="flex flex-col max-h-[80%] max-w-[80%] min-w-[80%] min-h-[80%] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50"
							style={{ borderRadius: "6px" }}
						>
							<DialogHeader className="max-h-[10px] h-[10px]">
								<DialogTitle>Save</DialogTitle>
							</DialogHeader>
							<div className="h-[87%] w-full max-h-[87%] min-h-[87%] overflow-auto mt-4">
								<SaveMenu
									explorerData={explorerData}
									saveItemDestination={saveItemDestination}
									setSaveItemDestination={setSaveItemDestination}
								/>
							</div>
							<DialogFooter className="fixed right-10 bottom-8 gap-6 w-[80%]">
								<Input
									placeholder="File Name"
									className="w-[100%] self-start rounded  bg-zinc-800"
									value={saveItemTextInput}
									onChange={(e: any) => setSaveItemTextInput(e.target.value)}
								></Input>
								<Button
									variant="outline"
									className="rounded"
									onClick={() => setSaveMenuOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={() => handleSaveNewFile()} className="rounded">
									Save
								</Button>
							</DialogFooter>
						</DialogContent>
					</DialogPortal>
				</Dialog>
			)}
			{openMenuOpen && (
				<Dialog open={openMenuOpen} onOpenChange={setOpenMenuOpen}>
					<DialogPortal>
						<DialogContent
							className="flex flex-col max-h-[80%] max-w-[80%] min-w-[80%] min-h-[80%] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50"
							style={{ borderRadius: "6px" }}
						>
							<DialogHeader className="max-h-[10px] h-[10px]">
								<DialogTitle>Open</DialogTitle>
							</DialogHeader>
							<div className="h-[87%] w-full max-h-[87%] min-h-[87%] overflow-auto mt-4">
								<OpenMenu
									explorerData={explorerData}
									openItemDestination={openItemDestination}
									setOpenItemDestination={setOpenItemDestination}
								/>
							</div>
							<DialogFooter className="fixed right-10 bottom-8">
								<Button
									variant="outline"
									className="rounded"
									onClick={() => setOpenMenuOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={() => handleOpenFile()} className="rounded">
									Open
								</Button>
							</DialogFooter>
						</DialogContent>
					</DialogPortal>
				</Dialog>
			)}
		</main>
	);
}
