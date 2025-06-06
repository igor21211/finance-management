# Finance Management Application

A modern web application for personal finance management built with Next.js 14 and TypeScript. This application helps users track their expenses, manage accounts, and categorize transactions.

## Features

- 💳 **Account Management**

  - Create and manage multiple financial accounts
  - Track account balances
  - Bulk delete functionality

- 💰 **Transaction Tracking**

  - Add, edit, and delete transactions
  - Bulk import transactions
  - Categorize transactions
  - Filter transactions by date and account
  - Search and sort functionality

- 📊 **Categories**

  - Create custom transaction categories
  - Organize expenses by category
  - Category-based filtering

- 🔒 **Authentication**

  - Secure user authentication with Clerk
  - Protected routes
  - User profile management

- 📱 **Responsive Design**
  - Modern and clean UI with Tailwind CSS
  - Mobile-friendly interface
  - Smooth animations and transitions

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**:
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Shadcn/ui](https://ui.shadcn.com/) components
- **State Management**:
  - [TanStack Query](https://tanstack.com/query) (React Query)
  - React Hooks
- **Data Tables**: [TanStack Table](https://tanstack.com/table)
- **API Layer**: [Hono](https://hono.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd finance-management
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
# Add other required environment variables
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `features/` - Feature-based modules (accounts, transactions, categories)
- `lib/` - Utility functions and shared logic
- `db/` - Database schema and configurations
- `hooks/` - Custom React hooks
- `public/` - Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
