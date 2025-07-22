export interface MenuItem {
	name: string;
	ingredients: string;
	image?: string;
}

export interface MenuConfig {
	menus: MenuItem[];
	token: string;
}
