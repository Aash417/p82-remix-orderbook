import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
   uri:
      import.meta.env.VITE_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql',
});

// Set up the WebSocket link for subscriptions (only on client-side).
const wsLink =
   typeof window !== 'undefined'
      ? new GraphQLWsLink(
           createClient({
              url:
                 import.meta.env.VITE_GRAPHQL_WS_URL ||
                 'ws://localhost:4000/graphql',
           }),
        )
      : null;

// The split function can send data to each link depending on what kind of operation is being sent.
const splitLink = wsLink
   ? split(
        ({ query }) => {
           const definition = getMainDefinition(query);
           return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
           );
        },
        wsLink, // If it's a subscription, use wsLink.
        httpLink, // Otherwise, use httpLink.
     )
   : httpLink; // Use only HTTP link on server-side

export const apolloClient = new ApolloClient({
   link: splitLink,
   cache: new InMemoryCache(),
   ssrMode: typeof window === 'undefined', // Enable SSR mode on server
});
