import Image from "next/image";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import { signOut } from "@/services/protoshopServices";

export default function Nav({
	handleDownload,
	loggedIn,
	setSaveMenuOpen,
	setOpenMenuOpen,
	handleSaveFile,
	handleClearFile,
}: {
	setImageFile: (value: File | null) => void;
	handleDownload: () => void;
	loggedIn: boolean;
	username: string | undefined;
	setSaveMenuOpen: (value: boolean) => void;
	setOpenMenuOpen: (value: boolean) => void;
	handleSaveFile: () => void;
	handleClearFile: () => void;
}) {
	return (
		<nav className="flex flex-row gap-4 min-h-[4%] w-full items-center justify-between pl-8 bg-zinc-950 shadow-[0px_20px_68px_37px_#101012]">
			<div className="flex flex-row">
				<Image
					src="/prototype-logo.png"
					width={30}
					height={30}
					alt="Logo Icon"
					className="mr-8"
					priority
				></Image>
				<Menubar className="bg-zinc-950 border-none text-white active:bg-zinc-200">
					<MenubarMenu>
						<MenubarTrigger>File</MenubarTrigger>
						<MenubarContent className="bg-zinc-950 border-none text-white">
							<MenubarItem onClick={() => handleClearFile()}>
								New File
							</MenubarItem>
							<MenubarItem onClick={() => handleSaveFile()}>Save</MenubarItem>
							<MenubarItem onClick={() => setSaveMenuOpen(true)}>
								Save As
							</MenubarItem>
							<MenubarItem onClick={() => setOpenMenuOpen(true)}>
								Open
							</MenubarItem>
							<MenubarItem onClick={handleDownload}>Download</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger>Account</MenubarTrigger>

						{loggedIn ? (
							<MenubarContent className="bg-zinc-950 border-none text-white">
								<MenubarItem asChild>
									<Link href="/user">Manage Files</Link>
								</MenubarItem>
								<MenubarItem asChild>
									<Link href="/account-settings">Account Settings</Link>
								</MenubarItem>
								<MenubarItem onClick={() => signOut()}>
									<a href="/">Log Out</a>
								</MenubarItem>
							</MenubarContent>
						) : (
							<MenubarContent className="bg-zinc-950 border-none text-white">
								<MenubarItem asChild>
									<a href="https://us-east-1fzoyjj6v8.auth.us-east-1.amazoncognito.com/login/continue?client_id=42ofhk29neqi1c714b9n7ncvi5&redirect_uri=https%3A%2F%2Fprotoshop.vercel.app%2F&response_type=code&scope=email+openid+phone">
										Log In
									</a>
								</MenubarItem>
							</MenubarContent>
						)}
					</MenubarMenu>
				</Menubar>
			</div>
		</nav>
	);
}
