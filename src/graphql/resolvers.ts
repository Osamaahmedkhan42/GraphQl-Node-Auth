import { user } from './user';

const resolvers = {
    Query: {

        ...user.resolvers.queries,


    },
    Mutation: {

        ...user.resolvers.mutations,

    },
};

export default resolvers;
