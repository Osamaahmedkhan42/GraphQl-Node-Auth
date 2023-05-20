import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql';

import validator from 'validator';

function validateEmail(email) {
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email address');
    }
}

function validateUsername(username) {
    // Define a regular expression to match the username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

    // Test the username against the regular expression
    if (usernameRegex.test(username)) {
        return true; // The username is valid
    } else {
        return false; // The username is invalid
    }
}

const prisma = new PrismaClient()

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
const signup = async (_, { signupInput }) => {

    //validating name
    if (!validateUsername(signupInput.name)) {
        throw new Error('Invalid username');
    }

    //validating email
    validateEmail(signupInput.email)

    //validating passwords
    if (signupInput.password != signupInput.passwordConfirm) {
        throw new GraphQLError("Password Mismatched", {
            extensions: { code: '409' },
        })

    }

    const hashedPassword = await bcrypt.hash(signupInput.password, 12)

    const newUser = await prisma.users.create({
        data: {
            name: signupInput.name,
            email: signupInput.email,
            password: hashedPassword,
            v: 0, // This property is required by the usersCreateInput type
            accountType: 'User', // This property is required by the usersCreateInput type
            active: true, // This property is required by the usersCreateInput type
        },
    })


    //creating jwt
    const token = signToken(newUser.id)
    newUser.password = undefined

    const userT = { name: newUser.name, email: newUser.email };
    return { token, user: userT };

}

export default signup