import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";


//import { createConnection } from "typeorm";
//import { User } from "./entity/User";



(async () => {// async and await code. logic to start server
    const app = express();
    app.get(`/`, (_request, response) => response.send('hello'))

    const apolloServer = new ApolloServer({//grapghql define graph ql schema
        schema: await buildSchema({//build schema  takes our resolvers and creates gql schema await cus async function
           resolvers: [UserResolver]//array of resolvers
       }) 
    });
    //lastly add 
    apolloServer.applyMiddleware({ app });//added grapgh ql to the app/ server 
    app.listen(4000, () => {
        console.log(`server has started http://localhost:4000/graphql`)
    });
})();

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
