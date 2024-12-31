import Nav from "@/components/ui/FilesNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import localFont from "next/font/local";

const raderFont = localFont({
	src: "../../public/fonts/PPNeueBit-Bold.otf",
});

const raderFontItalic = localFont({
	src: "../../public/fonts/PPNeueBit-Bold.otf",
});

export default function AccountSettings() {
	let username = "admin";

	return (
		<main className="flex min-h-screen flex-col bg-zinc-900">
			<Nav username={username}></Nav>
			{/* <div>{authCode}</div> */}
			<div className="px-[200px] w-full h-screen flex flex-row justify-between">
				<Separator
					orientation="horizontal"
					className="w-[1px] h-screen"
				></Separator>
				<div className="w-full m-4 flex flex-col gap-8 items-center justify-center mt-[-300px]">
					<div className="flex flex-col gap-8">
						<h2 className={`text-4xl ${raderFontItalic.className}`}>
							Update Password
						</h2>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="current_password">Current Password</Label>
							<Input
								type="password"
								id="current_password"
								placeholder="Current Password"
								style={{ borderRadius: "6px" }}
							/>
						</div>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="new_password">New Password</Label>
							<Input
								type="password"
								id="new_password"
								placeholder="New Password"
								style={{ borderRadius: "6px" }}
							/>
						</div>
						<Button style={{ borderRadius: "6px" }}>Confirm</Button>
					</div>
					<Separator orientation="horizontal" className="w-1/2"></Separator>
					<div className="flex flex-col gap-8">
						<h2 className={`text-4xl ${raderFontItalic.className}`}>
							Delete Account
						</h2>

						<Button
							className="text-xl p-8"
							style={{ borderRadius: "6px" }}
							variant="destructive"
						>
							Delete Account
						</Button>
					</div>
				</div>

				<Separator
					orientation="horizontal"
					className="w-[1px] h-screen"
				></Separator>
			</div>
		</main>
	);
}
