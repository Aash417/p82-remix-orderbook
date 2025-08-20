import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

// Set up the HTTP link for queries and mutations.
const httpLink = new HttpLink({
   uri: 'http://localhost:4000/graphql', // Your backend's HTTP endpoint
});

// Set up the WebSocket link for subscriptions.
const wsLink = new GraphQLWsLink(
   createClient({
      url: 'ws://localhost:4000/graphql', // Your backend's WebSocket endpoint
   }),
);

// The split function can send data to each link depending on what kind of operation is being sent.
const splitLink = split(
   ({ query }) => {
      const definition = getMainDefinition(query);
      return (
         definition.kind === 'OperationDefinition' &&
         definition.operation === 'subscription'
      );
   },
   wsLink, // If it's a subscription, use wsLink.
   httpLink, // Otherwise, use httpLink.
);

// Create the Apollo Client instance.
export const apolloClient = new ApolloClient({
   link: splitLink,
   cache: new InMemoryCache(),
});
