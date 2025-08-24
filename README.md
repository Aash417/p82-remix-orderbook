# Real-time Orderbook

A real-time cryptocurrency orderbook application built with React Router, GraphQL, and WebSocket subscriptions. The project demonstrates real-time data handling, state management with XState, and modern web development practices.

## Features

- 📊 Real-time orderbook updates via WebSocket
- 💱 Live trade execution and updates
- 🌓 Dark/Light theme support
- 🎯 Client and Server-side state management
- ⚡ Built with performance in mind

## Tech Stack

### Frontend (apps/web)
- React + React Router
- Apollo Client for GraphQL
- XState for state management
- TailwindCSS for styling
- GraphQL WebSocket subscriptions

### Backend (apps/server)
- Express
- Apollo Server
- GraphQL
- WebSocket support
- Inversify for dependency injection

## Project Structure

```
apps/
  ├── server/           # Backend GraphQL server
  │   ├── src/
  │   │   ├── core/     # Core business logic
  │   │   ├── graphql/  # GraphQL schema and resolvers
  │   │   └── services/ # Business service layer
  │   └── package.json
  │
  └── web/             # Frontend React application
      ├── app/
      │   ├── components/
      │   ├── graphql/   # GraphQL operations
      │   └── lib/       # Utilities and hooks
      └── package.json

packages/               # Shared configurations
  ├── eslint-config/
  └── typescript-config/
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the backend server:
   ```bash
   cd apps/server
   pnpm run dev
   ```

3. Start the frontend application:
   ```bash
   cd apps/web
   pnpm run dev
   ```

4. Visit `http://localhost:5173` in your browser

## Development

- The project uses pnpm workspaces for package management
- Real-time updates are handled through GraphQL subscriptions
- State management is handled by XState
- Styling is done with TailwindCSS

## API Endpoints

- GraphQL HTTP: `http://localhost:4000/graphql`
- WebSocket: `ws://localhost:4000/graphql`

## Environment Variables

### Backend
```env
PORT=4000
```

### Frontend
```env
VITE_GRAPHQL_HTTP_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT
