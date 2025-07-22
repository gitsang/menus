import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const API_URL = 'https://api.siliconflow.cn/v1/images/generations';

async function generateMenuImage(prompt, token) {
	try {
		const requestData = {
			model: 'Kwai-Kolors/Kolors',
			prompt: `Food photography of ${prompt}, professional lighting, high quality, appetizing`,
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
	// 读取配置文件
	const configPath = path.join(process.cwd(), 'static', 'menu.yaml');
	const yamlContent = fs.readFileSync(configPath, 'utf8');
	const config = yaml.load(yamlContent);

	if (!config.token || config.token === 'xxxxxx') {
		console.error('请在 static/menu.yaml 中设置有效的 API token');
		process.exit(1);
	}

	// 创建图片目录
	const imagesDir = path.join(process.cwd(), 'static', 'images');
	if (!fs.existsSync(imagesDir)) {
		fs.mkdirSync(imagesDir, { recursive: true });
	}

	console.log('开始生成菜单图片...');

	// 为每个菜单项生成图片
	for (const item of config.menus) {
		const imageName = `${item.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
		const imagePath = path.join(imagesDir, imageName);

		// 如果图片已存在，跳过
		if (fs.existsSync(imagePath)) {
			console.log(`图片已存在，跳过: ${imageName}`);
			item.image = `/images/${imageName}`;
			continue;
		}

		console.log(`正在生成 ${item.name} 的图片...`);

		const imageUrl = await generateMenuImage(item.name, config.token);
		if (imageUrl) {
			const downloaded = await downloadImage(imageUrl, imagePath);
			if (downloaded) {
				console.log(`✓ 成功生成: ${imageName}`);
				item.image = `/images/${imageName}`;
			} else {
				console.log(`✗ 下载失败: ${imageName}`);
			}
		} else {
			console.log(`✗ 生成失败: ${imageName}`);
		}

		// 添加延迟避免 API 限制
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	// 更新配置文件，包含图片路径
	const updatedYaml = yaml.dump(config);
	fs.writeFileSync(configPath, updatedYaml);

	console.log('图片生成完成！');
}

main().catch(console.error);
