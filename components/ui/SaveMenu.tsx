import { useState } from "react";
import Image from "next/image";

export default function SaveMenu({
	explorerData,
	saveItemDestination,
	setSaveItemDestination,
}: {
	explorerData: any;
	saveItemDestination: any;
	setSaveItemDestination: any;
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
						<div className="flex gap-4">
							<p>{explorerData.createdAt}</p>
						</div>
					</div>
					<div style={expand ? { display: "block" } : { display: "none" }}>
						{explorerData.objChildren.toReversed().map((item: any) => (
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