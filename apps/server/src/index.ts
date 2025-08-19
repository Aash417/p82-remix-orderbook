import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { v4 as uuid } from 'uuid';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
   type Task {
      id: ID!
      title: String!
      status: String!
   }

   type Query {
      tasks: [Task!]!
   }

   type Mutation {
      createTask(title: String!): Task!
      updateTaskStatus(id: ID!, status: String!): Task!
      deleteTask(id: ID!): Boolean!
   }
`;

let tasks = [
   { id: uuid(), title: 'Learn XState', status: 'todo' },
   { id: uuid(), title: 'Set up Apollo Client', status: 'inProgress' },
   { id: uuid(), title: 'check', status: 'inProgress' },
];

const resolvers = {
   Query: {
      tasks: () => tasks,
   },
   Mutation: {
      createTask: (_: any, { title }: { title: string }) => {
         const newTask = { id: uuid(), title, status: 'todo' };
         tasks.push(newTask);
         return newTask;
      },
      updateTaskStatus: (
         _: any,
         { id, status }: { id: string; status: string },
      ) => {
         const task = tasks.find((t) => t.id === id);
         if (!task) throw new Error('Task not found');
         task.status = status;
         return task;
      },
      deleteTask: (_: any, { id }: { id: string }) => {
         const taskIndex = tasks.findIndex((t) => t.id === id);
         if (taskIndex === -1) throw new Error('Task not found');
         tasks.splice(taskIndex, 1);
         return true;
      },
   },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
   typeDefs,
   resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
   listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
