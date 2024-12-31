import { redirect } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function generateAccessToken(authCode: string | null) {
	if (!authCode) {
		console.error("No authCode provided");
		return;
	}

	try {
		let response = await fetch(backendUrl + `/login/${authCode}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		return data;
	} catch (err) {
		console.error("Login error:", err);
	}
}

export async function getUserObject() {
	try {
		let response = await fetch(backendUrl + `/UserObject`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		console.log(await data);
		return data;
	} catch (err) {
		console.error("User object fetching error:", err);
	}
}

export async function createFolder(newFolderName: any, parentId: string) {
	try {
		let response = await fetch(backendUrl + `/CreateFolder/${parentId}`, {
			method: "POST",
			body: JSON.stringify({ name: `${newFolderName}` }),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		return data;
	} catch (err) {
		console.error("Create Folder error:", err);
	}
}

export async function addFile(
	objId: string,
	newFolderName: string,
	parentId: string
) {
	try {
		let response = await fetch(backendUrl + `/AddFile/${parentId}`, {
			method: "POST",
			body: JSON.stringify({
				objId: objId,
				name: `${newFolderName}`,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		return data;
	} catch (err) {
		console.error("Add File error:", err);
	}
}

export async function getFile(objId: string) {
	try {
		let response = await fetch(backendUrl + "/GetFile", {
			method: "POST",
			body: JSON.stringify({
				objId: `${objId}`,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		console.log(data);
		return data.url;
	} catch (err) {
		console.error("Get File error:", err);
	}
}

export async function getFileContent(objId: string) {
	try {
		let response = await fetch(backendUrl + "/GetFileContent", {
			method: "POST",
			body: JSON.stringify({
				objId: `${objId}`,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		const blob = await response.blob();
		return blob;
	} catch (err) {
		console.error("Get File Content error:", err);
	}
}

export async function addS3File(formData: FormData) {
	try {
		let response = await fetch(backendUrl + `/AddS3File`, {
			method: "POST",
			body: formData,
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response}`);
			return;
		}

		let data = await response.text();
		return data;
	} catch (err) {
		console.error("Rename error:", err);
	}
}

export async function renameFile(newName: any, objToRenameId: string) {
	try {
		let response = await fetch(backendUrl + `/RenameItem/${objToRenameId}`, {
			method: "POST",
			body: JSON.stringify({ name: `${newName}` }),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		return data;
	} catch (err) {
		console.error("Rename error:", err);
	}
}

export async function deleteFile(file: any) {
	try {
		let response = await fetch(backendUrl + `/Delete/${file.objId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		return data;
	} catch (err) {
		console.error("Delete error:", err);
	}
}

export async function moveFile(objId: string, destinationId: string) {
	try {
		let response = await fetch(backendUrl + `/MoveItem`, {
			method: "POST",
			body: JSON.stringify({
				objId: `${objId}`,
				newParentId: `${destinationId}`,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		return data;
	} catch (err) {
		console.error("Move File error:", err);
	}
}

export async function signOut() {
	const url =
		"https://us-east-1fzoyjj6v8.auth.us-east-1.amazoncognito.com/logout?client_id=42ofhk29neqi1c714b9n7ncvi5&redirect_uri=https%3A%2F%2Fprotoshop.vercel.app%2F";

	try {
		let response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		return data;
	} catch (err) {
		console.error("Error signing out:", err);
	}

	try {
		let response = await fetch(backendUrl + `/SignOut`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Server error: ${response.statusText}`);
			return;
		}

		let data = await response.json();
		redirect("/");
		return data;
	} catch (err) {
		console.error("Error signing out:", err);
	}
}
