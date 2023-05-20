import { PrismaClient } from '@prisma/client'
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


interface UserInput {
    name?: string;
    email?: string;
}


const prisma = new PrismaClient()

//edit user works with ID and the ID will be provided by context when the user is logged in!

const editUser = async (_, { ID, userInput }: { ID: string, userInput: UserInput }) => {
    const { name, email } = userInput;
    const updateData: UserInput = {};
    if (name) {
        //validating name
        if (!validateUsername(name)) {
            throw new Error('Invalid username');
        }
        updateData.name = name;
    }
    if (email) {
        validateEmail(email);
        updateData.email = email.toLowerCase();
    }


    const updateUser = await prisma.users.update({
        where: {
            id: ID,
        },
        data: updateData
    })

    const userT = { name: updateUser.name, email: updateUser.email };

    return { user: userT };
}
export default editUser