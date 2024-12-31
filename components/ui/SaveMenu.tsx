import { useState } from "react";
import Image from "next/image";
import { UserDirectory } from "@/interfaces/UserObject";

export default function SaveMenu({
	explorerData,
	saveItemDestination,
	setSaveItemDestination,
}: {
	explorerData: UserDirectory | undefined;
	saveItemDestination: string | undefined;
	setSaveItemDestination: (arg0: string | undefined) => void;
}) {
	const [expand, setExpand] = useState(false);

	return (
		<>
			{explorerData?.isFolder && (
				<div className="w-full pl-4 flex flex-col">
					<div
						className={`p-4 flex w-full justify-between hover:cursor-pointer hover:bg-zinc-800 rounded-xl ${
							saveItemDestination === explorerData.objId ? "bg-zinc-900" : ""
						}`}
						onClick={() => {
							setExpand((prev) => !prev);
							setSaveItemDestination(explorerData.objId);
						}}
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
					</div>
					<div style={expand ? { display: "block" } : { display: "none" }}>
						{[...explorerData.objChildren]
							.reverse()
							.map((item: UserDirectory) => (
								<SaveMenu
									explorerData={item}
									key={item.objId}
									saveItemDestination={saveItemDestination}
									setSaveItemDestination={setSaveItemDestination}
								/>
							))}
					</div>
				</div>
			)}
		</>
	);
}
