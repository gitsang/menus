import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const API_URL = 'https://api.siliconflow.cn/v1/images/generations';

async function generateMenuImage(name, ingredients, token) {
	try {
		const requestData = {
			model: 'Kwai-Kolors/Kolors',
			prompt: `Food photography of ${name} made with ${ingredients}, professional lighting, high quality, appetizing, detailed food styling`,
			image_size: '512x512',
			batch_size: 1,
			num_inference_steps: 20,
			guidance_scale: 7.5
		};

		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestData)
		});

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		const data = await response.json();
		return data.images[0]?.url || null;
	} catch (error) {
		console.error('Failed to generate image:', error);
		return null;
	}
}

async function downloadImage(url, filePath) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to download image: ${response.status}`);
		}

		const buffer = await response.arrayBuffer();
		fs.writeFileSync(filePath, new Uint8Array(buffer));
		return true;
	} catch (error) {
		console.error('Failed to download image:', error);
		return false;
	}
}

async function main() {
	// Read configuration files
	const configPath = path.join(process.cwd(), 'static', 'menu.yaml');
	const secretPath = path.join(process.cwd(), 'secret.yaml');

	const yamlContent = fs.readFileSync(configPath, 'utf8');
	const config = yaml.load(yamlContent);

	// Read token from secret file
	let token;
	if (fs.existsSync(secretPath)) {
		const secretContent = fs.readFileSync(secretPath, 'utf8');
		const secretConfig = yaml.load(secretContent);
		token = secretConfig.token;
	}

	if (!token || token === 'xxxxxx') {
		console.error('Please set a valid API token in secret.yaml');
		process.exit(1);
	}

	// Create images directory
	const staticDir = path.join(process.cwd(), 'static');
	if (!fs.existsSync(staticDir)) {
		fs.mkdirSync(staticDir, { recursive: true });
	}

	console.log('Starting menu image generation...');

	for (const item of config.menus) {
		if (item.image === '') {
			console.log(`No image for ${item.name}, skipping...`);
			continue;
		}

		const imagePath = path.join(staticDir, item.image);

		// Skip if image already exists
		if (fs.existsSync(imagePath)) {
			console.log(`Image already exists, skipping: ${item.image}`);
			continue;
		}
		console.log(`Generating image to ${item.image} for ${item.name}...`);

		// Generate image
		const imageUrl = await generateMenuImage(item.name, item.ingredients, token);
		if (imageUrl) {
			const downloaded = await downloadImage(imageUrl, imagePath);
			if (downloaded) {
				console.log(`✓ Successfully generated: ${item.image}`);
			} else {
				console.log(`✗ Download failed: ${item.image}`);
			}
		} else {
			console.log(`✗ Generation failed: ${item.image}`);
		}

		// Add delay to avoid API rate limits
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	console.log('Image generation completed!');
}

main().catch(console.error);
