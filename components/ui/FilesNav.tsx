"use client";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localFont from "next/font/local";
import Link from "next/link";
import { signOut } from "@/services/protoshopServices";
import { redirect } from "next/dist/server/api-utils";
import { Separator } from "./separator";

const raderFont = localFont({
	src: "../../public/fonts/PPNeueBit-Bold.otf",
});

const raderFontItalic = localFont({
	src: "../../public/fonts/PPNeueBit-Bold.otf",
});

export default function Nav({ username }: { username: any }) {
	return (
		<div>
			<nav className="flex h-[70px] w-screen bg-zinc-950 shadow-[0px_20px_68px_37px_#101012] justify-between items-center px-[220px]">
				<Link href="/user">
					<div className="flex w-[400px] pl-4 items-center gap-4">
						<Image
							src="/prototype-logo.png"
							width={30}
							height={30}
							alt="Logo Icon"
							className="mr-8"
							priority
						></Image>
						<h2 className={`text-4xl ${raderFont.className}`}>Protoshop.</h2>
					</div>
				</Link>
				<div className="flex h-full items-center justify-center gap-8 pr-4">
					{username && (
						<div
							className={`content-center text-2xl ${raderFontItalic.className}`}
						>
							Hello {username}
						</div>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Image
								src="/settings-icon.png"
								width={30}
								height={30}
								alt=""
							></Image>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-56 mr-[185px] mt-2 bg-zinc-950"
							style={{ borderRadius: "6px" }}
						>
							<DropdownMenuLabel>Settings</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<Link href="/">
									<DropdownMenuItem>
										<span>Home</span>
									</DropdownMenuItem>
								</Link>
								<Link href="/account-settings">
									<DropdownMenuItem>
										<span>Account Settings</span>
									</DropdownMenuItem>
								</Link>
								<DropdownMenuItem
									onClick={() => {
										signOut();
									}}
								>
									<a href="/">Sign Out</a>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</nav>
			<Separator className="w-screen" orientation="horizontal"></Separator>
		</div>
	);
}
