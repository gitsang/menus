# Menu Website

A Svelte-based menu website that displays menu items from a YAML configuration file and generates images using AI.

## 1. Features

- ✨ YAML-based menu configuration
- 🖼️ AI-powered image generation for menu items
- 📱 Responsive design with Tailwind CSS
- ⚡ Built with SvelteKit for optimal performance

## 2. Configuration

Edit the `static/menu.yaml` file to configure your menu items:

```yaml
menus:
  - name: americano
    ingredients: water, espresso
    price: '$3.50'
  - name: latte
    ingredients: water, espresso, milk
    price: '$4.50'
  - name: Tequila Sunrise
    ingredients: Tequila, Lemon, Pomegranate Syrup, Orange Juice
    price: '$8.00'
token: xxxxxx # Replace with your API token
```

Make sure to replace `xxxxxx` with your actual SiliconFlow API token to enable image generation.

## 3. Image Generation

Generate menu images before building:

```bash
npm run generate
```

This will:

- Generate AI images for each menu item using the SiliconFlow API
- Save images to `static/images/` directory
- Update the YAML configuration with image paths
- Skip existing images to avoid regeneration

## 4. Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## 5. Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## 6. Container Deployment

The project includes Docker containerization with nginx for production deployment.

### 6.1 Build and Deploy

```bash
# Build web assets and container image
npm run build

# Deploy using Docker Compose
npm run deploy
```

### 6.2 Additional Container Commands

```bash
# Build only web assets
npm run build:web

# Build only container image
npm run build:container

# Stop deployment
npm run deploy:stop

# View container logs
npm run deploy:logs
```

### 6.3 Manual Container Commands

```bash
# Build container image
docker build -f Containerfile -t menu-website .

# Run with Docker Compose
docker compose up -d

# Stop containers
docker compose down
```

The application will be available at http://localhost:8080
