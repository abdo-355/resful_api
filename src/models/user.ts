import { Schema, model, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  status: string;
  posts?: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: "I am new!" },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export default model<IUser>("User", userSchema);
