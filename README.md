# mrxublog - Personal Lab Interface

A futuristic, sci-fi/lab-themed personal portfolio and blog interface built with React, Vite, and Tailwind CSS. The project functions as a modern frontend for a headless WordPress backend, utilizing dynamic animations and a unique "node-based" spatial hub navigation.

## ✨ Features

- **Sci-Fi / Terminal Aesthetic:** Beautifully crafted UI resembling a high-tech terminal, "Analysis OS", or personal laboratory tracking system.
- **Node-Based Spatial Navigation:** A draggable, scalable hub view where different sections (Articles, Gallery, Projects) are represented as scattered "nodes" connected to a central core.
- **Headless WordPress Integration:** Dynamically fetches data, categories, and custom application modules (`app_module` Custom Post Type) from a WordPress REST API.
- **Smooth Animations:** Powered by `motion/react` (Framer Motion) for intricate transition sequences, layout animations, and an immersive initial "Login" sequence.
- **Responsive Layout:** Works flawlessly across mobile devices and desktop wide-screens.

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data & API:** Fetch API connected to WordPress REST API

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── LoginSequence.tsx  # Initial sci-fi "boot up" & authorization screen
│   │   └── MainInterface.tsx  # The core workspace, including HubView and Detail nodes
│   ├── services/
│   │   └── wpService.ts       # WordPress REST API fetch logic (Categories, Posts, Modules)
│   ├── types.ts               # Global TypeScript definitions & interfaces
│   ├── App.tsx                # Main application entry point (Router & State)
│   ├── main.tsx               # React DOM rendering
│   └── index.css              # Global Tailwind configuration & fonts
├── .env.example               # Environment variables template
├── package.json               # Project dependencies and npm scripts
└── vite.config.ts             # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+ recommended) and `npm`, `yarn`, or `pnpm` installed.

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env` and update the WordPress API URL point to your backend:
   ```bash
   VITE_WP_API_URL=https://your-wordpress-site.com/wp-json
   ```
   *(If not provided, the app will fall back to a default demonstration API).*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:
```bash
npm run build
```
Files will be exported to the `/dist` directory.

## 🔌 WordPress Backend Setup

To get the most out of this frontend, your headeless WordPress installation should be configured with:

1. **Custom Post Type:** Needs an `app_module` Custom Post Type to define the Hub Nodes.
2. **Advanced Custom Fields (ACF):**
   - `module_id` (Text)
   - `module_type` (Select: `ARTICLE_LIST`, `SINGLE_PHOTO`, `TEXT_LABEL`, `SINGLE_ARTICLE`)
   - `module_desc` (Text)
   - `module_icon` (Text - Lucide Icon name)
   - `wp_category_slug` (Text - maps the node to a WordPress category)
   - `module_size` (Select: `small`, `medium`, `large`)
3. **Categories:** Create standard WordPress categories like `gallery`, `projects`, `articles` that match the configurations in your modules.

## 📄 License

This project is private and intended for personal portfolio use.
