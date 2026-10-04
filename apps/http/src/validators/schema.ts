import z from "zod";

export const signupSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

export const signinSchema = signupSchema.pick({
  email: true,
  password: true,
});
