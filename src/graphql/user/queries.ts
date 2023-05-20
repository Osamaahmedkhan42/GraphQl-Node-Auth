// TypeDefs for queries

export const queries = `#graphql
  
  type User {
    name:String
    email:String
    token:String
    password:String
    
  }

  type UserData{
    name:String
    email:String
  }

  type Test {
 
  id: String
  topic:String
  title:String
  description:String
  }

  type RandomUser{
    results:[Rdata]
    
  }
  type Rdata{
    gender:String
    email:String
    phone:String
    cell:String
  }

type Query {
    getSingleUser: User!
    getUsers:[UserData]
  }
  
`