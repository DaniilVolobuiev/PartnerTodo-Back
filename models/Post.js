import mongoose from 'mongoose';

const PostScema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    todoStrings: {
      type: Array,
      default: [
        {
          id: Number,
          string: String,
          edit: false,
        },
      ],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      immutable: true,
    },
    imageUrl: String,
    liked: {
      type: Boolean,
      default: false,
    },
    liked: Boolean,
    userName: String,
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('Post', PostScema);
