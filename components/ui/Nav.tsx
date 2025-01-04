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
	const cognitoLoginUrl = process.env.NEXT_PUBLIC_COGNITO_LOGIN_URL;
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
						{loggedIn ? (
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
						) : (
							<MenubarContent className="bg-zinc-950 border-none text-white">
								<MenubarItem onClick={() => handleClearFile()}>
									New File
								</MenubarItem>
								<MenubarItem onClick={handleDownload}>Download</MenubarItem>
							</MenubarContent>
						)}
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
									{/* <a href=""> */}
									<a href={cognitoLoginUrl}>Log In</a>
								</MenubarItem>
							</MenubarContent>
						)}
					</MenubarMenu>
				</Menubar>
			</div>
		</nav>
	);
}
