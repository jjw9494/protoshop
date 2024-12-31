import Image from "next/image";
import { useState } from "react";
import {
	deleteFile,
	renameFile,
	createFolder,
	addFile,
	moveFile,
	addS3File,
	getFile,
} from "@/services/protoshopServices";
import { File, Folder, ArrowDownUp, Trash, Pencil, Eye } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogPortal,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface DialogState {
	isOpen: boolean;
	type: "createFolder" | "addFile" | "rename" | "delete" | "move" | null;
}

export default function Explorer({
	explorerData,
	setExplorerData,
	moveItemExplorerData,
}: {
	explorerData: any;
	setExplorerData: any;
	moveItemExplorerData: any;
}) {
	const [expand, setExpand] = useState(false);
	const [moveItemObjId, setMoveItemObjId] = useState("");
	const [moveItemDestination, setMoveItemDestination] = useState("");
	const [moveFileDialogOpen, setMoveFileDialogOpen] = useState(false);

	const handleOpenMoveItemDialog = (objId: string) => {
		setMoveItemObjId(objId);
		setMoveFileDialogOpen(true);
	};

	const handleMoveItem = async () => {
		try {
			const response = await moveFile(moveItemObjId, moveItemDestination);
			if (response) {
				setExplorerData(response);
				toast("Success", {
					description: "File moved successfully",
				});
			} else {
				throw new Error("Failed to move file");
			}
		} catch (error) {
			console.error(error);
			toast("Error", {
				description: "Error moving file",
			});
		} finally {
			setMoveFileDialogOpen(false);
			setMoveItemObjId("");
			setMoveItemDestination("");
		}
	};

	return (
		<>
			{explorerData.isFolder ? (
				<div className="w-full pl-4 flex flex-col">
					<div
						className="p-4 flex w-full justify-between hover:cursor-pointer hover:bg-zinc-800 rounded-xl"
						onClick={() => setExpand((prev) => !prev)}
					>
						<div className="flex gap-4 w-full ml-4">
							<Image
								src="/folder-icon.png"
								height={10}
								width={25}
								alt="folder icon"
							/>
							<p>{explorerData.name}</p>
						</div>
						<div className="flex gap-4">
							<p>{explorerData.createdAt}</p>
							<ExplorerFolderOptions
								explorerData={explorerData}
								setExplorerData={setExplorerData}
								setExpand={setExpand}
								handleOpenMoveItemDialog={handleOpenMoveItemDialog}
							/>
						</div>
					</div>
					<div style={expand ? { display: "block" } : { display: "none" }}>
						{explorerData.objChildren.toReversed().map((item: any) => (
							<Explorer
								moveItemExplorerData={moveItemExplorerData}
								explorerData={item}
								key={item.objId}
								setExplorerData={setExplorerData}
							/>
						))}
					</div>
				</div>
			) : (
				<div className="p-4 flex w-full justify-between hover:cursor-pointer hover:bg-zinc-800 rounded-xl">
					<div className="flex pl-4 gap-4 ml-4">
						<Image
							src="/file-icon.png"
							height={10}
							width={25}
							alt="file icon"
						/>
						<p>{explorerData.name}</p>
					</div>
					<div className="flex gap-8 flex-0 justify-center items-center">
						<ExplorerFileOptions
							explorerData={explorerData}
							setExplorerData={setExplorerData}
							handleOpenMoveItemDialog={handleOpenMoveItemDialog}
						/>
					</div>
				</div>
			)}

			{moveFileDialogOpen && (
				<Dialog open={moveFileDialogOpen} onOpenChange={setMoveFileDialogOpen}>
					<DialogPortal>
						<DialogContent
							className="flex flex-col max-h-[80%] max-w-[80%] min-w-[80%] min-h-[80%] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50"
							style={{ borderRadius: "6px" }}
						>
							<DialogHeader className="max-h-[10px] h-[10px]">
								<DialogTitle>Move Item</DialogTitle>
							</DialogHeader>
							<div className="h-[87%] w-full max-h-[87%] min-h-[87%] overflow-auto mt-4">
								<MoveItemExplorer
									moveItemExplorerData={moveItemExplorerData}
									setMoveItemDestination={setMoveItemDestination}
									moveItemDestination={moveItemDestination}
								/>
							</div>
							<DialogFooter className="fixed right-10 bottom-8">
								<Button
									variant="outline"
									className="rounded"
									onClick={() => setMoveFileDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={handleMoveItem} className="rounded">
									Confirm
								</Button>
							</DialogFooter>
						</DialogContent>
					</DialogPortal>
				</Dialog>
			)}
		</>
	);
}

function ExplorerFolderOptions({
	explorerData,
	setExplorerData,
	setExpand,
	handleOpenMoveItemDialog,
}: {
	explorerData: any;
	setExplorerData: any;
	setExpand: any;
	handleOpenMoveItemDialog: any;
}) {
	const [dialogState, setDialogState] = useState<DialogState>({
		isOpen: false,
		type: null,
	});
	const [createFolderInputValue, setCreateFolderInputValue] = useState("");
	const [renameInputValue, setRenameInputValue] = useState(explorerData.name);
	const [addFileNameInputValue, setAddFileNameInputValue] = useState("");
	const [addFileContent, setAddFileContent] = useState<any | null>("");

	const closeDialog = () => {
		setDialogState({ isOpen: false, type: null });
		setCreateFolderInputValue("");
		setRenameInputValue(explorerData.name);
		setAddFileNameInputValue("");
		setAddFileContent(null);
	};

	const openDialog = (type: DialogState["type"]) => {
		setDialogState({ isOpen: true, type });
	};

	const handleCreateFolder = async () => {
		try {
			const response = await createFolder(
				createFolderInputValue,
				explorerData.objId
			);
			if (response) {
				setExplorerData(response);
				toast("Success", {
					description: "Folder created successfully",
				});
			} else {
				throw new Error("Failed to create folder");
			}
		} catch (error) {
			toast("Error", {
				description: "Error creating folder",
			});
		} finally {
			closeDialog();
			setExpand(true);
		}
	};

	const handleAddFile = async () => {
		try {
			const uuid = uuidv4();
			const response = await addFile(
				uuid,
				addFileNameInputValue,
				explorerData.objId
			);
			if (response) {
				setExplorerData(response);
				const formData = new FormData();
				formData.append("FileId", uuid);
				formData.append("FileContent", addFileContent);
				await addS3File(formData);
				toast("Success", {
					description: "File added successfully",
				});
			} else {
				throw new Error("Failed to add file");
			}
		} catch (error) {
			toast("Error", {
				description: "Error adding file",
			});
		} finally {
			closeDialog();
			setExpand(true);
		}
	};

	const handleRename = async () => {
		try {
			const response = await renameFile(renameInputValue, explorerData.objId);
			if (response) {
				setExplorerData(response);
				toast("Success", {
					description: "Item renamed successfully",
				});
			} else {
				throw new Error("Failed to rename item");
			}
		} catch (error) {
			toast("Error", {
				description: "Error renaming item",
			});
		} finally {
			closeDialog();
		}
	};

	const handleDelete = async () => {
		try {
			const response = await deleteFile(explorerData);
			if (response) {
				setExplorerData(response);
				toast("Success", {
					description: "Item deleted successfully",
				});
			} else {
				throw new Error("Failed to delete item");
			}
		} catch (error) {
			toast("Error", {
				description: "Error deleting item",
			});
		} finally {
			closeDialog();
		}
	};

	const renderDialogContent = () => {
		switch (dialogState.type) {
			case "createFolder":
				return (
					<>
						<DialogHeader className="flex flex-col gap-4">
							<DialogTitle>Create New Folder</DialogTitle>
							<div className="grid w-full max-w-sm items-center gap-1.5">
								<Label htmlFor="create-folder">Folder Name</Label>
								<Input
									type="text"
									id="create-folder"
									placeholder="Folder Name"
									className="rounded"
									value={createFolderInputValue}
									onChange={(e) => setCreateFolderInputValue(e.target.value)}
								/>
							</div>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								className="rounded"
								onClick={closeDialog}
							>
								Cancel
							</Button>
							<Button onClick={handleCreateFolder} className="rounded">
								Create
							</Button>
						</DialogFooter>
					</>
				);

			case "addFile":
				return (
					<>
						<DialogHeader className="flex flex-col gap-4 mb-4">
							<DialogTitle>Add New File</DialogTitle>
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="add-file-name">File Name</Label>
								<Input
									type="text"
									id="add-file-name"
									placeholder="File Name"
									className="rounded"
									value={addFileNameInputValue}
									onChange={(e) => setAddFileNameInputValue(e.target.value)}
								/>
							</div>
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="add-file">Choose File</Label>
								<Input
									type="file"
									id="add-file"
									className="w-full"
									onChange={(e) =>
										setAddFileContent(e.target.files?.[0] || null)
									}
								/>
							</div>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								className="rounded"
								onClick={closeDialog}
							>
								Cancel
							</Button>
							<Button onClick={handleAddFile} className="rounded">
								Add File
							</Button>
						</DialogFooter>
					</>
				);

			case "rename":
				return (
					<>
						<DialogHeader className="flex flex-col gap-4">
							<DialogTitle>Rename Item</DialogTitle>
							<div className="grid w-full max-w-sm items-center gap-1.5">
								<Label htmlFor="rename">New Name</Label>
								<Input
									type="text"
									id="rename"
									placeholder={explorerData.name}
									className="rounded"
									value={renameInputValue}
									onChange={(e) => setRenameInputValue(e.target.value)}
								/>
							</div>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								className="rounded"
								onClick={closeDialog}
							>
								Cancel
							</Button>
							<Button onClick={handleRename} className="rounded">
								Rename
							</Button>
						</DialogFooter>
					</>
				);

			case "delete":
				return (
					<>
						<DialogHeader>
							<DialogTitle>Delete Confirmation</DialogTitle>
							<DialogDescription>
								Do you want to delete this item? This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								className="rounded"
								onClick={closeDialog}
							>
								Cancel
							</Button>
							<Button onClick={handleDelete} className="rounded">
								Delete
							</Button>
						</DialogFooter>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Image
						src="/more-options-icon.png"
						height={10}
						width={25}
						alt="options"
						className="mr-4 cursor-pointer"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>Options</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => openDialog("createFolder")}>
							<Folder className="mr-2" />
							<span>Create Folder</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => openDialog("addFile")}>
							<File className="mr-2" />
							<span>Add File</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => openDialog("rename")}>
							<Pencil className="mr-2" />
							<span>Rename</span>
						</DropdownMenuItem>
						{explorerData.objId !== "root" && (
							<>
								<DropdownMenuItem
									onClick={() => handleOpenMoveItemDialog(explorerData.objId)}
								>
									<ArrowDownUp className="mr-2" />
									<span>Move</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => openDialog("delete")}>
									<Trash className="mr-2" />
									<span>Delete</span>
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog
				open={dialogState.isOpen}
				onOpenChange={(open) => !open && closeDialog()}
			>
				<DialogPortal>
					<DialogContent
						className="rounded fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50"
						style={{ borderRadius: "6px" }}
					>
						{renderDialogContent()}
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</>
	);
}

function ExplorerFileOptions({
	explorerData,
	setExplorerData,
	handleOpenMoveItemDialog,
}: {
	explorerData: any;
	setExplorerData: any;
	handleOpenMoveItemDialog: any;
}) {
	const [dialogState, setDialogState] = useState<DialogState>({
		isOpen: false,
		type: null,
	});
	const [renameInputValue, setRenameInputValue] = useState(explorerData.name);

	const closeDialog = () => {
		setDialogState({ isOpen: false, type: null });
		setRenameInputValue(explorerData.name);
	};

	const openDialog = (type: DialogState["type"]) => {
		setDialogState({ isOpen: true, type });
	};

	const handleGetFile = async (objId: string) => {
		try {
			const response = await getFile(objId);
			if (response) {
				window.open(`${response}`, "_blank");
			} else {
				throw new Error("Failed to get signed URL");
			}
		} catch (error) {
			console.error("Error fetching signed URL:", error);
			toast("Error", {
				description: "Error previewing file",
			});
		}
	};

	const handleDelete = async () => {
		try {
			const response = await deleteFile(explorerData);
			if (response) {
				setExplorerData(response);
				toast("Success", {
					description: "File deleted successfully",
				});
			} else {
				throw new Error("Failed to delete file");
			}
		} catch (error) {
			toast("Error", {
				description: "Error deleting file",
			});
		} finally {
			closeDialog();
		}
	};

	const handleRename = async () => {
		try {
			const response = await renameFile(renameInputValue, explorerData.objId);
			if (response) {
				setExplorerData(response);
				toast("Success", {
					description: "File renamed successfully",
				});
			} else {
				throw new Error("Failed to rename file");
			}
		} catch (error) {
			toast("Error", {
				description: "Error renaming file",
			});
		} finally {
			closeDialog();
		}
	};

	const renderDialogContent = () => {
		switch (dialogState.type) {
			case "rename":
				return (
					<>
						<DialogHeader className="flex flex-col gap-4">
							<DialogTitle>Rename File</DialogTitle>
							<div className="grid w-full max-w-sm items-center gap-1.5">
								<Label htmlFor="rename">New Name</Label>
								<Input
									type="text"
									id="rename"
									placeholder={explorerData.name}
									className="rounded"
									value={renameInputValue}
									onChange={(e) => setRenameInputValue(e.target.value)}
								/>
							</div>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								className="rounded"
								onClick={closeDialog}
							>
								Cancel
							</Button>
							<Button onClick={handleRename} className="rounded">
								Rename
							</Button>
						</DialogFooter>
					</>
				);

			case "delete":
				return (
					<>
						<DialogHeader>
							<DialogTitle>Delete Confirmation</DialogTitle>
							<DialogDescription>
								Do you want to delete this file? This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								className="rounded"
								onClick={closeDialog}
							>
								Cancel
							</Button>
							<Button onClick={handleDelete} className="rounded">
								Delete
							</Button>
						</DialogFooter>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Image
						src="/more-options-icon.png"
						height={10}
						width={25}
						alt="options"
						className="mr-[9px] cursor-pointer"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>Options</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => handleGetFile(explorerData.objId)}>
							<Eye className="mr-2" />
							<span>Preview</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => openDialog("rename")}>
							<Pencil className="mr-2" />
							<span>Rename</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleOpenMoveItemDialog(explorerData.objId)}
						>
							<ArrowDownUp className="mr-2" />
							<span>Move</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => openDialog("delete")}>
							<Trash className="mr-2" />
							<span>Delete</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog
				open={dialogState.isOpen}
				onOpenChange={(open) => !open && closeDialog()}
			>
				<DialogPortal>
					<DialogContent
						className="rounded fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50"
						style={{ borderRadius: "6px" }}
					>
						{renderDialogContent()}
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</>
	);
}

function MoveItemExplorer({
	moveItemDestination,
	setMoveItemDestination,
	moveItemExplorerData,
}: {
	moveItemDestination: string;
	setMoveItemDestination: (id: string) => void;
	moveItemExplorerData: any;
}) {
	const [expand, setExpand] = useState(false);

	if (moveItemExplorerData.isFolder) {
		return (
			<div className="w-full pl-4 flex flex-col">
				<div
					className={`p-4 flex w-full justify-between hover:cursor-pointer hover:bg-stone-800 rounded-xl ${
						moveItemDestination === moveItemExplorerData.objId
							? "bg-stone-900"
							: ""
					}`}
					onClick={() => {
						setExpand((prev) => !prev);
						setMoveItemDestination(moveItemExplorerData.objId);
					}}
				>
					<div className="flex gap-4 w-full ml-4">
						<Image
							src="/folder-icon.png"
							height={10}
							width={25}
							alt="folder icon"
						/>
						<p>{moveItemExplorerData.name}</p>
					</div>
				</div>
				<div style={expand ? { display: "block" } : { display: "none" }}>
					{moveItemExplorerData?.objChildren?.map((item: any) => (
						<MoveItemExplorer
							key={item.objId}
							moveItemDestination={moveItemDestination}
							moveItemExplorerData={item}
							setMoveItemDestination={setMoveItemDestination}
						/>
					))}
				</div>
			</div>
		);
	}
	return null;
}
