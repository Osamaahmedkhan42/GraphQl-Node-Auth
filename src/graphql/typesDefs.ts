
import { user } from './user'

const typeDefs = `#graphql
   
    ${user.types}
    ${user.mutations}
    ${user.types}
    ${user.queries}

   
`
export default typeDefs;