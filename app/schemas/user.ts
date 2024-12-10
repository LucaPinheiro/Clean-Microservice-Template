import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(), 
  name: z.string().min(1, "Name is required"), 
  email: z.string().email("Invalid email address"), 
  password: z.string().min(6, "Password must be at least 6 characters long"), 
});

export const userPublicSchema = userSchema.omit({ password: true });

export type UserSchema = z.infer<typeof userSchema>;
export type UserPublicSchema = z.infer<typeof userPublicSchema>;


