import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


//get user by id
const getSingleUser = async (_, __, context) => {
    return await prisma.users.findUnique(
        {
            where: {
                id: context._id

            }
        }

    )
}
export default getSingleUser;