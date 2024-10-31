// Use https://medium.com/@aren.talb00/creating-a-custom-file-input-using-react-and-useref-233f5d4abfc9 for info on how to implement a custom file input
import { ChangeEvent, useRef, useState } from "react";
import styles from "../styles/CustomFileInput.module.css";
import React from "react";

export function CustomFileInput({ setImageFile }: { setImageFile: any }) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageUploadClick = () => {
		fileInputRef.current?.click();
	};

	const updateImage = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			setImageFile(file);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			const file = event.dataTransfer.files[0];
			setImageFile(file);
		}
	};

	return (
		<div className={"container"}>
			<div
				className={styles.dropZone}
				onDragOver={handleDragOver}
				onDrop={handleFileDrop}
				onClick={handleImageUploadClick}
			>
				<span>Choose file or drag it here</span>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					style={{ display: "none" }}
					onChange={updateImage}
				/>
			</div>
		</div>
	);
}
