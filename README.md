# Sonity - Music Streaming Platform

A modern music streaming platform built with Next.js 15, featuring audio streaming and a clean user interface.

## Features

- **Audio Streaming**: Stream music with multiple format support
- **Modern UI**: Clean, responsive design with glass morphism effects
- **Multiple Formats**: MP3, FLAC, WAV, M4A, OGG, AAC support
- **Search & Discovery**: Find music easily with search functionality
- **Responsive Design**: Works seamlessly on desktop and mobile

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database

### Installation

```bash
# Clone repository
git clone https://github.com/theamanone/sonity.git
cd sonity

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Create a `.env` file with following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Razorpay (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons

## Contributing

1. Fork repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under MIT License - see the LICENSE file for details.
