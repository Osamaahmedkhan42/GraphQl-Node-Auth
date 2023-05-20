import getSingleUser from './Query/getSingleUser';
import getUsers from './Query/getUsers';

import deleteUser from './Mutation/deleteUser';
import editUser from './Mutation/editUser';
import forgotPassword from './Mutation/forgotPassword';
import login from './Mutation/login';
import resetPassword from './Mutation/resetPassword';
import signup from './Mutation/signup';
import updatePassword from './Mutation/updatePassword';

const queries = {
    getSingleUser,
    getUsers
};

const mutations = {
    deleteUser,
    editUser,
    forgotPassword,
    login,
    resetPassword,
    signup,
    updatePassword
};

export const resolvers = { queries, mutations };
