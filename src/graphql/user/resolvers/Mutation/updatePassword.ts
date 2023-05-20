
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const correctPassword = async (candidatePass, userPass) => {
    return await bcrypt.compare(candidatePass, userPass)
}

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

//take id when person is logged in
const updatePassword = async (_, { updatePassInput }) => {

    //const currentUser = await prisma.findById(req.user.id).select('+password')
    const currentUser = await prisma.users.findUnique({
        where: {
            email: 'vajaw76201@jobsfeel.com'
        }
    })

    if (!await correctPassword(updatePassInput.currentPass, currentUser.password)) {
        //         return next(new appError('Current Password is wrong', 401))
        throw new Error('Current Password is wrong');

    }


    const hashedPassword = await bcrypt.hash(updatePassInput.newPass, 12)

    const updateUser = await prisma.users.update({
        where: {
            id: currentUser.id,
        },
        data: {
            password: hashedPassword,
        },
    })

    const token = signToken(currentUser.id)

    const userT = { name: currentUser.name, email: currentUser.email };
    return { token, user: userT };


}
export default updatePassword

