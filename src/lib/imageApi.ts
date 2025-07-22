export interface ImageGenerationRequest {
	model: string;
	prompt: string;
	image_size: string;
	batch_size: number;
	num_inference_steps: number;
	guidance_scale: number;
}

export interface ImageGenerationResponse {
	images: Array<{
		url: string;
		b64_json?: string;
	}>;
}

export async function generateMenuImage(prompt: string, token: string): Promise<string | null> {
	try {
		const requestData: ImageGenerationRequest = {
			model: 'Kwai-Kolors/Kolors',
			prompt: `Food photography of ${prompt}, professional lighting, high quality, appetizing`,
			image_size: '1024x1024',
			batch_size: 1,
			num_inference_steps: 20,
			guidance_scale: 7.5
		};

		const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
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

		const data: ImageGenerationResponse = await response.json();
		return data.images[0]?.url || null;
	} catch (error) {
		console.error('Failed to generate image:', error);
		return null;
	}
}
