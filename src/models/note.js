import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      default: 'Todo',
      enum: TAGS,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Note = model('Note', noteSchema);

export default Note;
