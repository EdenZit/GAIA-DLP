// lib/db/crud/users.ts
import { User } from '../models/user'
import dbConnect from '@/lib/mongodb'

export class UserService {
  // Create
  async createUser(userData: any) {
    await dbConnect()
    const user = new User(userData)
    return await user.save()
  }

  // Read
  async getUserById(id: string) {
    await dbConnect()
    return await User.findById(id)
  }

  async getUserByEmail(email: string) {
    await dbConnect()
    return await User.findOne({ email })
  }

  async getAllUsers(page = 1, limit = 10) {
    await dbConnect()
    const skip = (page - 1) * limit
    
    const [users, total] = await Promise.all([
      User.find({})
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({})
    ])
    
    return { users, total }
  }

  // Update
  async updateUser(id: string, updateData: any) {
    await dbConnect()
    return await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    )
  }

  // Delete
  async deleteUser(id: string) {
    await dbConnect()
    const result = await User.findByIdAndDelete(id)
    return !!result
  }
}
