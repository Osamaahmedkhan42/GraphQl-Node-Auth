
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const getUsers = async () => {
    //return await User.find()
    const allUsers = await prisma.users.findMany()

    return allUsers
}

export default getUsers;