import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/use/ws';
import http from 'http';
import 'reflect-metadata';
import { WebSocketServer } from 'ws';

import { resolvers } from '@/graphql/resolvers';
import { typeDefs } from '@/graphql/schema';
import { OrderService } from '@/services/orderService';
import { PubSubService } from '@/services/PubSubService';
import { TYPES } from '@/types/inversify.types';
import { inversifyContainer } from '../inversify.config';

const PORT = 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
   server: httpServer,
   path: '/graphql',
});

// Get service instances from our DI container
const orderService = inversifyContainer.get<OrderService>(TYPES.OrderService);
const pubSubService = inversifyContainer.get<PubSubService>(
   TYPES.PubSubService,
);

//  handles the WebSocket connection with proper context
const serverCleanup = useServer(
   {
      schema,
      context: async (ctx, msg, args) => ({
         orderService,
         pubSubService,
      }),
   },
   wsServer,
);

const server = new ApolloServer({
   schema,
   plugins: [
      // Plugin to properly shut down the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Plugin to properly shut down the WebSocket server.
      {
         async serverWillStart() {
            return {
               async drainServer() {
                  await serverCleanup.dispose();
               },
            };
         },
      },
   ],
});

await server.start();

app.use(
   cors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
   }),
);

// Apollo Server runs as Express middleware.
app.use(
   '/graphql',
   express.json(),
   expressMiddleware(server, {
      context: async () => ({
         orderService,
         pubSubService,
      }),
   }),
);
app.get('/', (req, res) => {
   res.json({ msg: 'Server is up' });
});

httpServer.listen(PORT, () => {
   console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
   console.log(`🚀 Subscription endpoint at ws://localhost:${PORT}/graphql`);
});
