import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  status: string;
  posts: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  posts: [{ type: String, ref: "Post" }],
});

export default model<IUser>("User", userSchema);
