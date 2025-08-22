# Remix Orderbook

This is a full-stack orderbook application built with Remix, a full-stack web framework for React. The application provides a real-time orderbook, order form, and recent trades display.

## Features

- **Real-time Orderbook**: View real-time orderbook updates with bids and asks.
- **Order Submission**: Submit new buy or sell orders through a dedicated form.
- **Recent Trades**: See a list of the most recent trades.
- **GraphQL API**: The backend is powered by a GraphQL API with real-time updates via subscriptions.
- **Modern UI**: The frontend is built with shadcn/ui and Tailwind CSS for a clean and modern user interface.

## Technologies Used

- **Frontend**:
   - [Remix](https://remix.run/)
   - [React](https://reactjs.org/)
   - [TypeScript](https://www.typescriptlang.org/)
   - [shadcn/ui](https://ui.shadcn.com/)
   - [Tailwind CSS](https://tailwindcss.com/)
   - [Vite](https://vitejs.dev/)

- **Backend**:
   - [Node.js](https://nodejs.org/)
   - [Express](https://expressjs.com/)
   - [GraphQL](https://graphql.org/)
   - [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
   - [InversifyJS](httphttps://inversify.io/) for dependency injection

- **Monorepo Management**:
   - [pnpm](https://pnpm.io/)
   - [Turbo](https://turbo.build/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation)

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/your-username/remix-orderbook.git
   cd remix-orderbook
   ```

2. **Install dependencies**:
   ```sh
   pnpm install
   ```

### Running the Application

To start the development servers for both the web and server applications, run the following command from the root of the project:

```sh
pnpm dev
```

This will start the web application on `http://localhost:3000` and the GraphQL server on `http://localhost:4000`.

## Available Scripts

- `pnpm dev`: Starts the development servers for both the web and server applications.
- `pnpm build`: Builds the applications for production.
- `pnpm start`: Starts the production servers.
- `pnpm lint`: Lints the codebase.
- `pnpm test`: Runs the test suite.

## Project Structure

The project is organized as a monorepo with the following structure:

- `apps/`: Contains the individual applications.
   - `server/`: The GraphQL backend server.
   - `web/`: The Remix frontend application.
- `packages/`: Contains shared packages.
   - `eslint-config/`: Shared ESLint configurations.
   - `typescript-config/`: Shared TypeScript configurations.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
