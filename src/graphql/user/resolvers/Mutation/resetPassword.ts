import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import bcrypt from 'bcrypt'


const prisma = new PrismaClient()

const resetPassword = async (_, { resetPasswordInput }, req) => {

    //validating passwords
    if (resetPasswordInput.password != resetPasswordInput.confirmPassword) {
        throw new Error('Password and Confirm Password do not Match!');

    }

    // 1. Get user based on token
    const hashedToken = crypto.createHash('sha256').update(resetPasswordInput.token).digest('hex')

    const user = await prisma.users.findFirst({
        where: {
            passwordResetToken: hashedToken,
            passwordResetExpires: { gt: new Date() }
        }
    })

    if (!user) {
        //return next(new appError('Token in invalid or expired', 400))
        return "TOKEN EXPIRED"
    }
    // 2. If token is not expired and there is a user set new pass

    const hashedPassword = await bcrypt.hash(resetPasswordInput.password, 12)

    await prisma.users.update({
        where: {

            id: user.id
        },
        data: {
            //making pasword hashed
            password: hashedPassword,
            passwordResetToken: undefined,
            passwordResetExpires: undefined
        },
    })

    return "password reset sucessful"
}
export default resetPassword