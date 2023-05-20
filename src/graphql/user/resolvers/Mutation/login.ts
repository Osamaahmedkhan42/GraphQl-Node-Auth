import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient()

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const correctPassword = async (candidatePass, userPass) => {
    return await bcrypt.compare(candidatePass, userPass)
}

const login = async (_, { loginInput: { email, password } }, context) => {

    //check email pass exsists
    if (!email || !password) {
        throw new GraphQLError("Plz provide email and password", {
            extensions: { code: '400' },
        })
    }
    //checking if user exsists

    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    })

    //checking if pass is correct

    if (!user || !await correctPassword(password, user.password)) {
        throw new GraphQLError("Incorrect Email or Password", {
            extensions: { code: '401' },
        });
    }
    //cerating JWT


    const token = signToken(user.id)

    user.password = undefined

    const userT = { name: user.name, email: user.email };

    return { token, user: userT };


}

export default login;