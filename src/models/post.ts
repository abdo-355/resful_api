import { Schema, model, Types } from "mongoose";

interface DocumentResult<T> {
  _doc: T;
}

interface IPost extends DocumentResult<IPost> {
  title: string;
  imgUrl: string;
  content: string;
  creator: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IPost>("Post", postSchema);
