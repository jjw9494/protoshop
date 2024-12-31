import { useState } from "react";
import Image from "next/image";
import { UserDirectory } from "@/interfaces/UserObject";

export default function OpenMenu({
	explorerData,
	openItemDestination,
	setOpenItemDestination,
}: {
	explorerData: UserDirectory | undefined;
	openItemDestination: string | undefined;
	setOpenItemDestination: (arg0: string | undefined) => void;
}) {
	const [expand, setExpand] = useState(false);

	return (
		<>
			{explorerData?.isFolder ? (
				<div className="w-full pl-4 flex flex-col">
					<div
						className={`p-4 flex w-full justify-between hover:cursor-pointer hover:bg-zinc-800 rounded-xl`}
						onClick={() => {
							setExpand((prev) => !prev);
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
								<OpenMenu
									explorerData={item}
									key={item.objId}
									openItemDestination={openItemDestination}
									setOpenItemDestination={setOpenItemDestination}
								/>
							))}
					</div>
				</div>
			) : (
				<div
					className={`p-4 flex w-full justify-between hover:cursor-pointer hover:bg-zinc-800 rounded-xl ${
						openItemDestination === explorerData?.objId ? "bg-zinc-900" : ""
					}`}
				>
					<div
						className="flex pl-4 gap-4 ml-4"
						onClick={() => setOpenItemDestination(explorerData?.objId)}
					>
						<Image
							src="/file-icon.png"
							height={10}
							width={25}
							alt="file icon"
						/>
						<p>{explorerData?.name}</p>
					</div>
				</div>
			)}
		</>
	);
}
