import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


//ID will be provided by currently logged iN user
const deleteUser = async (_, { ID }) => {
    const wasDeleted = await prisma.users.delete({
        where: {
            id: ID
        },
    })
    return wasDeleted
}
export default deleteUser;