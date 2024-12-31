"use client";

import { Separator } from "@/components/ui/separator";
import { Suspense, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserObject } from "@/services/protoshopServices";
import Explorer from "@/components/ui/Explorer";
import Nav from "@/components/ui/FilesNav";
import { TopLevelUserObject } from "@/interfaces/UserObject";

export default function User() {
	const [explorerData, setExplorerData] = useState<TopLevelUserObject>();
	const [username, setUsername] = useState<string>("");

	useEffect(() => {
		const getData = async () => {
			const response = await getUserObject();
			if (response) {
				setExplorerData(response);
				setUsername(response.username);
			}
		};
		getData();
	}, []);

	return (
		<main className="flex min-h-screen flex-col bg-zinc-900 overflow-x-clip pointer-events-auto">
			{" "}
			{/* Add pointer-events-auto */}
			<Nav username={username}></Nav>
			<div className="px-[200px] w-full h-screen flex flex-row justify-between pointer-events-auto">
				{" "}
				{/* Add pointer-events-auto */}
				<Separator
					orientation="horizontal"
					className="w-[1px] h-screen opacity-[100%]"
				></Separator>
				<div className="w-full m-4 pointer-events-auto">
					{" "}
					{/* Add pointer-events-auto */}
					<ScrollArea className="w-full h-[90%] pointer-events-auto">
						{" "}
						{/* Add pointer-events-auto */}
						{explorerData ? (
							<Explorer
								moveItemExplorerData={explorerData?.directory[0]}
								explorerData={explorerData?.directory[0]}
								setExplorerData={setExplorerData}
							></Explorer>
						) : (
							<div className="flex justify-center text-white items-center content-center h-full pt-[200px]">
								<Suspense>Loading...</Suspense>
							</div>
						)}
					</ScrollArea>
				</div>
				<Separator
					orientation="horizontal"
					className="w-[1px] h-full opacity-[100%]"
				></Separator>
			</div>
		</main>
	);
}
