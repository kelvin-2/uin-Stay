# 🏠 uin-Stay

> A modern property listing and accommodation platform built with React and Supabase.

## Overview

uin-Stay is a full-featured accommodation listing web app that allows users to browse, search, and explore rental properties. It leverages Supabase for authentication and data storage, Cloudinary for optimised image delivery, and is deployed via Vercel.

## Features

- 🔍 Browse and search available property listings
- 🖼️ Optimised property images via Cloudinary
- 🔐 User authentication powered by Supabase
- 📱 Fully responsive design with Tailwind CSS
- 🔗 Client-side routing with React Router DOM


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router DOM v7 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Backend / DB | Supabase |
| Image Storage | Cloudinary |
| HTTP Client | Axios |
| Icons | Lucide React |
| Analytics | React GA4 |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- A [Supabase](https://supabase.com) project


### Installation

1. **Clone the repository**

```bash
git clone https://github.com/kelvin-2/uin-Stay.git
cd uin-Stay
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy the `.env` file and fill in your credentials:

```bash
cp .env .env.local
```

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

4. **Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
uin-Stay/
├── public/             # Static assets
├── src/                # Application source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level page components
│   └── ...
├── propertyData.json   # Seed / static property data
├── db.json             # Local mock database
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── vercel.json         # Vercel deployment config
```

## Deployment

The project is configured for one-click deployment on **Vercel**. A `vercel.json` is already included to handle client-side routing rewrites.

To deploy your own instance:

1. Fork this repository
2. Import the project into [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy 🚀

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is open source. See the repository for more details.

---

Built with ❤️ by [kelvin-2](https://github.com/kelvin-2)
