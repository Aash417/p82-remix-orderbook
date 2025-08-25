# Remix Orderbook

A real-time cryptocurrency orderbook application built with **React Router v7**, GraphQL, and WebSocket subscriptions. The project demonstrates real-time data handling, state management with XState, and modern web development practices using a monorepo structure with Turbo.

## Features

- 📊 Real-time orderbook updates via GraphQL WebSocket subscriptions
- 💱 Live trade execution and updates
- 🌓 Dark/Light theme support with Radix UI components
- 🎯 Advanced state management with XState
- ⚡ Built with performance in mind using Vite
- 🔄 Type-safe GraphQL operations
- 📱 Responsive design with TailwindCSS v4

## Tech Stack

### Frontend (`apps/web`)

- **React 19** + **React Router v7** (latest)
- **Apollo Client** for GraphQL operations
- **XState v5** for state management
- **TailwindCSS v4** for styling
- **Radix UI** for accessible components
- **Vite** for fast development and building

### Backend (`apps/server`)

- **Express 5** with TypeScript
- **Apollo Server** for GraphQL
- **GraphQL WebSocket subscriptions** for real-time updates
- **Inversify** for dependency injection
- **PM2** for production process management

### Infrastructure

- **Turbo** for monorepo management
- **TypeScript** for type safety
- **ESLint** + **Prettier** for code quality
- **npm** workspaces for package management

## Project Structure

```
├── apps/
│   ├── server/           # Backend GraphQL server
│   │   ├── src/
│   │   │   ├── core/     # Core business logic (matching engine, orderbook)
│   │   │   ├── graphql/  # GraphQL schema and resolvers
│   │   │   ├── services/ # Business service layer
│   │   │   └── types/    # TypeScript type definitions
│   │   └── dist/         # Compiled JavaScript output
│   │
│   └── web/             # Frontend React application
│       ├── app/
│       │   ├── components/  # Reusable UI components
│       │   ├── graphql/     # GraphQL operations and types
│       │   ├── lib/         # Utilities, hooks, and state management
│       │   └── routes/      # Application routes
│       └── build/           # Production build output
│
├── packages/              # Shared configurations
│   ├── eslint-config/     # ESLint rules
│   └── typescript-config/ # TypeScript configurations
│
└── turbo.json            # Turbo monorepo configuration
```

## Prerequisites

- **Node.js** 18+ (required)
- **npm** (recommended) or yarn
- **TypeScript** knowledge

## Development Commands

From the root directory:

```bash
# Development
npm dev              # Start both frontend and backend
npm build            # Build all applications
npm lint             # Lint all code
npm format           # Format code with Prettier
npm check-types      # Type-check all TypeScript code

# Individual app commands
cd apps/web && npm run dev      # Frontend only
cd apps/server && npm run dev   # Backend only
```

## API Endpoints

- **GraphQL HTTP**: `http://localhost:4000/graphql`
- **GraphQL WebSocket**: `ws://localhost:4000/graphql`

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in `apps/server/`:

```env
PORT=4000
NODE_ENV=development
```

### Frontend Environment Variables

Create a `.env` file in `apps/web/`:

```env
VITE_GRAPHQL_HTTP_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

## Key Components

### Frontend

- **OrderbookDisplay**: Real-time orderbook visualization
- **OrderForm**: Order placement interface
- **RecentTrades**: Live trade history
- **LiquidityBar**: Market depth visualization
- **ThemeProvider**: Dark/light theme management

### Backend

- **MatchingEngine**: Order matching algorithm
- **Orderbook**: Order management and state
- **OrderService**: Business logic for orders
- **PubSubService**: Real-time event broadcasting

## State Management

The application uses **XState v5** for complex state management:

- Order placement and validation
- Real-time data synchronization
- Theme switching
- Application lifecycle management

## Real-time Features

- **GraphQL Subscriptions** for live orderbook updates
- **WebSocket connections** for low-latency communication
- **Optimistic updates** for better user experience
- **Connection management** with automatic reconnection

## License

MIT License - see LICENSE file for details
