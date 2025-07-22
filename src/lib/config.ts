import yaml from 'js-yaml';
import type { MenuConfig } from './types.js';

export async function loadMenuConfig(): Promise<MenuConfig> {
	try {
		const response = await fetch('/menu.yaml');
		const yamlText = await response.text();
		const config = yaml.load(yamlText) as MenuConfig;
		return config;
	} catch (error) {
		console.error('Failed to load menu configuration:', error);
		throw error;
	}
}
