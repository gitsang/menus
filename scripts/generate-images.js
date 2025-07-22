import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const API_URL = 'https://api.siliconflow.cn/v1/images/generations';

async function generateMenuImage(name, ingredients, token) {
	try {
		const requestData = {
			model: 'Kwai-Kolors/Kolors',
			prompt: `Food photography of ${name} made with ${ingredients}, professional lighting, high quality, appetizing, detailed food styling`,
			image_size: '1024x1024',
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
	// Read configuration file
	const configPath = path.join(process.cwd(), 'static', 'menu.yaml');
	const yamlContent = fs.readFileSync(configPath, 'utf8');
	const config = yaml.load(yamlContent);

	if (!config.token || config.token === 'xxxxxx') {
		console.error('Please set a valid API token in static/menu.yaml');
		process.exit(1);
	}

	// Create images directory
	const imagesDir = path.join(process.cwd(), 'static', 'images');
	if (!fs.existsSync(imagesDir)) {
		fs.mkdirSync(imagesDir, { recursive: true });
	}

	console.log('Starting menu image generation...');

	// Generate images for each menu item
	for (const item of config.menus) {
		const imageName = `${item.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
		const imagePath = path.join(imagesDir, imageName);

		// Skip if image already exists
		if (fs.existsSync(imagePath)) {
			console.log(`Image already exists, skipping: ${imageName}`);
			item.image = `/images/${imageName}`;
			continue;
		}

		console.log(`Generating image for ${item.name}...`);

		const imageUrl = await generateMenuImage(item.name, item.ingredients, config.token);
		if (imageUrl) {
			const downloaded = await downloadImage(imageUrl, imagePath);
			if (downloaded) {
				console.log(`✓ Successfully generated: ${imageName}`);
				item.image = `/images/${imageName}`;
			} else {
				console.log(`✗ Download failed: ${imageName}`);
			}
		} else {
			console.log(`✗ Generation failed: ${imageName}`);
		}

		// Add delay to avoid API rate limits
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	// Update configuration file with image paths
	const updatedYaml = yaml.dump(config);
	fs.writeFileSync(configPath, updatedYaml);

	console.log('Image generation completed!');
}

main().catch(console.error);
