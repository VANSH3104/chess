import { NextRequest, NextResponse } from "next/server";
import { db } from "../../libs/prismadb";
import { z } from "zod";
import bcrypt from "bcrypt";

// Define the Zod schema
const userSchema = z.object({
  email: z.string().email().endsWith("@gmail.com"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(20),
  name: z.string().min(1, "Name is required").max(20),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    
    // Validate the body against the schema
    const parsedBody = userSchema.parse(body);
    
    const { email, password, name } = parsedBody;

    const existUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          msg: "Email is already created",
        },
        { status: 409 }
      );
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
    });

    return NextResponse.json({
      user: newUser,
      msg: "User created successfully",
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      {
        msg: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
};