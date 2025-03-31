// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/lib/repositories/userRepository";

const userRepository = new UserRepository();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const user = await userRepository.getUserById(userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 });
  }
}