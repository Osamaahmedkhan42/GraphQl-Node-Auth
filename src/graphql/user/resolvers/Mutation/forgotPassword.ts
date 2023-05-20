
import { emailIt } from '../../../../utils/sendEmail'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import validator from 'validator';
const prisma = new PrismaClient()

const createPasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex')
    //hashing the token
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); //1000 for millisec 10 min
    //send plain token and compare the token with one encrypted in database
    return { resetToken, passwordResetToken, passwordResetExpires }
}

function validateEmail(email) {
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email address');
    }
}

const forgotPassword = async (_, { email }, req) => {

    validateEmail(email)

    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    })
    if (!user) {
        throw new Error('No user exsists with this Email');
    }

    const { resetToken, passwordResetToken, passwordResetExpires } = createPasswordResetToken()

    await prisma.users.update({
        where: {
            email: email,
        },
        data: {
            passwordResetExpires,
            passwordResetToken,
        }
    })
    const resetURL = `${req.protocol}://${req.get('host')}/graphql/${resetToken}`
    const message = `Forgot your pass make a patch request to ${resetURL} with pass and passConfirm.\n If you did not forgot your pass plz ignore this email`
    try {
        await emailIt({
            email: user.email,
            subject: 'this token expires in 10 min',
            message
        })

    } catch (error) {
        console.log(error)

        await prisma.users.update({
            where: {
                email: email,
            },
            data: {
                passwordResetExpires: undefined,
                passwordResetToken: undefined,
            }
        })
        return "ERR"
    }
    return "Sucess"


}
export default forgotPassword;