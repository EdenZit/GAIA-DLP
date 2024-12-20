// app/api/test-db/route.ts
import { NextResponse } from 'next/server'
import { UserService } from '@/lib/db/crud/users'

export async function GET() {
  try {
    const userService = new UserService()
    const testUser = await userService.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123', // In production, this should be hashed
      role: 'student'
    })
    
    return NextResponse.json({ success: true, user: testUser })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    )
  }
}
