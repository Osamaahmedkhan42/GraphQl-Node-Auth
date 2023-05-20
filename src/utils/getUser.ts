// //import User from '../MongoModels/User'
import { promisify } from 'util';
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const changedPasswordAfter = (JWTtimeStamp, user) => {
    if (user.passwordChangedAt) {
        const testDate = user.passwordChangedAt.getTime() / 1000
        const changedTimeStamp = parseInt(testDate.toString(), 10)
        //console.log(changedTimeStamp, JWTtimeStamp)
        return JWTtimeStamp < changedTimeStamp
    }
    //false means no change here
    return false
}



const getUser = async (token) => {
    const verify = promisify(jwt.verify.bind(jwt));
    const decoded = await verify(token, process.env.JWT_SECRET);

    const user = await prisma.users.findUnique({
        where: {
            id: decoded.id,
        },
    })

    //     const user = await User.findById(decoded.id)
    if (!user) {
        return
    }

    if (changedPasswordAfter(decoded.iat, user)) {
        return
    }
    return user
}


export default getUser