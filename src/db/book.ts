import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema({
  ea_isbn: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    require: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  translator: {
    type: String,
  },
  title_url: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  publisher_predate: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
  },
  end_date: {
    type: String,
  },
  review: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("book", bookSchema);
