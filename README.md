# TextBook Admin Panel

## 🚀 Getting Started

### Prerequisites
- Node.js v20.x
- Backend API (see [Backend README](../Backend/README.md))
- Admin access credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/freelancing4044/text-book-admin.git
cd textbook-admin

# Install dependencies
npm install

# Start development server
npm run dev
```


### Project Structure

```
admin/
├── public/           # Static files
├── src/
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable components
│   ├── pages/        # Admin pages
│   ├── context/      # React context providers
│   ├── hooks/        # Custom hooks
│   ├── utils/        # Utility functions
│   ├── App.jsx       # Main App component
│   └── main.jsx      # Application entry point
├── .env.local        # Environment variables
├── .env.example      # Example env file
└── vite.config.js    # Vite configuration
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run test` - Run tests



### Building for Production

```bash
# Build the admin panel for production
npm run build

# The built files will be in the `dist` directory
```

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### or use the deployment method as per your choice

## 🔐 Security Considerations

- Keep the admin panel URL private
- Use strong passwords for admin accounts
- Regularly rotate admin tokens
- Monitor access logs

## 📦 Dependencies

- React 18
- React Router DOM
- Axios - HTTP client
- Redux Toolkit - State management
- Material-UI - Component library
- Vite - Build tool

## 📄 License

This project is licensed under the MIT License.
