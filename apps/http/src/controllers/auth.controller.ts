import { prisma } from "@repo/db";
import { asyncHandler } from "../utils/asyncHandler";
import { signinSchema, signupSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse";
import jwt from "jsonwebtoken";

export const signup = asyncHandler(async (req, res) => {
  const { success, data, error } = signupSchema.safeParse(req.body);

  if (!success) {
    throw new ApiError(400, "Invalid schema");
  }
  const { username, email, password } = data;

  const existUser = await prisma.user.findFirst({
    where: { email },
  });
  if (existUser) {
    throw new ApiError(400, "user already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });
  const u = await prisma.user.findUnique({
    where: { email: user.email },
    omit: {
      password: true,
    },
  });
  return res.json(
    new ApiResponse(201, {
      message: "signup successfull",
      u,
    }),
  );
});

export const signin = asyncHandler(async (req, res) => {
  const { success, data, error } = signinSchema.safeParse(req.body);
  if (!success) {
    throw new ApiError(400, "invalid schema");
  }
  const { email, password } = data;
  const existUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!existUser) {
    throw new ApiError(400, "user not found");
  }
  const verifyPassword = await bcrypt.compare(password, existUser.password);

  if (!verifyPassword) {
    throw new ApiError(402, "invalid creds");
  }
  const token = jwt.sign(
    {
      userId: existUser.id,
    },
    process.env.JWT_SECRET!,
  );

  return res.json(
    new ApiResponse(200, {
      message: "signin successfull",
      token,
    }),
  );
});

export const me = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res.json(new ApiResponse(200, { user }));
});
