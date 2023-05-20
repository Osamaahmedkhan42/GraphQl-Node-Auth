import { ApolloServer } from '@apollo/server';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import pkg from 'body-parser';
import * as dotenv from 'dotenv'
//ENV CONFIG
dotenv.config({ path: './config.env' });

import typeDefs from './graphql/typesDefs';
import resolvers from './graphql/resolvers'
import getUser from './utils/getUser';

//prisma
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
//
const { json } = pkg;

async function startApolloServer() {
  const app = express();

  const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://studio.apollographql.com'],
    credentials: true,
  };

  app.use(cors(corsOptions));

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',


  });



  await server.start();

  //MIDDLEWARE
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return req

        // // Get the user token from the headers.

        // const token = req.headers.authorization || '';

        // if (!token) {
        //   throw new GraphQLError('User is not authenticated')
        // }

        // // Try to retrieve a user with the token
        // const user = await getUser(token);
        // if (!user) {
        //   throw new GraphQLError('User is not authenticated')
        // }

        // // Add the user to the context
        // console.log(user)
        // return { user };
        //----------
        // return {
        //   dataSources: {
        //     moviesAPI: new RandomAPI(),
        //     userAPI: new RandomAPI2()
        //   },
        // }

        // return req

        // const user = await getUser(token);
        // console.log(user)


      },
    })
  );

  await new Promise<void>(resolve => {
    httpServer.listen({ port: 4001 }, resolve);
  });

  console.log('Apollo-Express Floor Started Successfully');
}



startApolloServer().then(() => console.log('Server is running on PORT:4001'));
