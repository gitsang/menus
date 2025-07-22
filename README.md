# Menu Website

A Svelte-based menu website that displays menu items from a YAML configuration file and generates images using AI.

## Features

- ✨ YAML-based menu configuration
- 🖼️ AI-powered image generation for menu items
- 📱 Responsive design with Tailwind CSS
- ⚡ Built with SvelteKit for optimal performance

## Configuration

Edit the `static/menu.yaml` file to configure your menu items:

```yaml
menus:
  - name: americano
    ingredients: water, espresso
    price: "$3.50"
  - name: latte
    ingredients: water, espresso, milk
    price: "$4.50"
  - name: Tequila Sunrise
    ingredients: Tequila, Lemon, Pomegranate Syrup, Orange Juice
    price: "$8.00"
token: xxxxxx # Replace with your API token
```

Make sure to replace `xxxxxx` with your actual SiliconFlow API token to enable image generation.

## Image Generation

Generate menu images before building:

```bash
npm run generate
```

This will:

- Generate AI images for each menu item using the SiliconFlow API
- Save images to `static/images/` directory
- Update the YAML configuration with image paths
- Skip existing images to avoid regeneration

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
