# 🌟 Get2KnowMe

> **The ultimate platform to showcase the real you** - Create your personalized digital identity with customizable widgets, social integrations, and a beautiful responsive design.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/jjramirezns-projects/v0-gettoknowme)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/BjoGlYO0X7Q)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

## ✨ Features

### 🎨 **Customizable Widgets**
- **Social Media Integration**: Connect your Instagram, Twitter, TikTok, Farcaster profiles
- **Professional Presence**: Showcase your GitHub contributions, Medium articles, Substack newsletters
- **Monetization**: Integrate Cafecito for tips and Calendly for bookings
- **ENS Identity**: Display your Ethereum Name Service identity with tip functionality

### 🎯 **Drag & Drop Interface**
- Intuitive widget positioning with collision detection
- Responsive grid system that adapts to any screen size
- Real-time preview of changes
- Mobile-optimized vertical layout

### 🎨 **Personalization**
- Custom color themes for widgets and backgrounds
- Profile customization with bio and avatar
- Unique username selection (get2knowme.app/yourname)
- Dark/light mode support

### 🔐 **Secure & Fast**
- Supabase authentication and database
- Real-time data synchronization
- Optimized performance with Next.js 15
- Type-safe development with TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/gettoknowme.git
   cd gettoknowme
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📱 Usage

### Creating Your Profile
1. **Sign up** with email and password
2. **Choose your username** (e.g., `yourname` → `get2knowme.app/yourname`)
3. **Customize your profile** with bio, avatar, and ENS identity
4. **Add widgets** from integrated services or preview upcoming features

### Widget Management
- **Drag widgets** to position them anywhere on your profile
- **Resize widgets** by dragging the corners
- **Change colors** using the color picker
- **Hide/show widgets** as needed
- **Edit integrations** by clicking the pencil icon

### Integrations
- **GitHub**: Show your contribution graph and total commits
- **Medium**: Display your latest articles with publication dates
- **Substack**: Showcase your newsletter content
- **Calendly**: Allow visitors to book meetings
- **Cafecito**: Accept tips from your audience

## 🎨 Customization

### Adding New Widgets
1. Add your widget type to `INTEGRATED_WIDGETS` or `PREVIEW_WIDGETS`
2. Create the widget component in `components/widget-system.tsx`
3. Add API route if external data is needed
4. Update the database schema if required

### Styling
- Modify `app/globals.css` for global styles
- Use Tailwind classes for component styling
- Custom colors are defined in CSS custom properties

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) - AI-powered development platform
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com/)

## 📞 Support

- **Documentation**: [v0.app/chat/projects/BjoGlYO0X7Q](https://v0.app/chat/projects/BjoGlYO0X7Q)
- **Issues**: [GitHub Issues](https://github.com/your-username/gettoknowme/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/gettoknowme/discussions)

---

<div align="center">
  <p>Made with ❤️ using <a href="https://v0.app">v0.app</a></p>
  <p><strong>🌟 Star this repo if you found it helpful!</strong></p>
</div>
