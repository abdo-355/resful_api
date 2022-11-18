import { Schema, model } from "mongoose";

interface IPost {
  title: string;
  imgUrl: string;
  content: string;
  // TODO: update that when adding the user model
  creator: Object;
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
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IPost>("Post", postSchema);
