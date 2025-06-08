import mongoose, { Mixed, Schema, Types } from "mongoose";

export interface IFile extends Document {
  user: Mixed | Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model<IFile>("File", fileSchema);
export default FileModel;
