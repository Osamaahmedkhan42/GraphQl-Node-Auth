// TypeDefs for mutations

export const mutations = `#graphql
   type Token {
  token: String!
  user: UserT
}

type UserT {
  name: String!
  email: String!
}

input ResetPassword{
  token:String
  password:String
  confirmPassword:String
}

 input UserInput {
    name:String
    email:String
 }

 input LoginInput {
    email:String
    password:String
 }
 input SignupInput {
    name:String
    email:String
    password:String
    passwordConfirm: String,
    #passwordChangedAt: String
 }

 input UpdatePass {
  id:ID!
  currentPass: String
  newPass: String
 }

  type Mutation {
    signup(signupInput: SignupInput): Token
    deleteUser(ID:ID!): Boolean
    editUser(ID:ID!,userInput: UserInput): Token
    login(loginInput: LoginInput):Token
    resetPassword(resetPasswordInput:ResetPassword):String
    forgotPassword(email:String):String
    updatePassword(updatePassInput:UpdatePass): Token

    
  }
  
`