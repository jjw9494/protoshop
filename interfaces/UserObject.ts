export interface TopLevelUserObject {
	id?: string;
	userId?: string;
	username?: string;
	directory: UserDirectory[];
}

export interface UserDirectory {
	objId?: string;
	name?: string;
	isFolder?: boolean;
	objChildren: UserDirectory[];
}
