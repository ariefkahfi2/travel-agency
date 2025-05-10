type UserResponse = {
  id: number
  name: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
  authToken?: string
}

export default UserResponse