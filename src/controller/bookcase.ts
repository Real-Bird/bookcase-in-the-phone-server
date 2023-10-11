import { Request, Response } from "express";
import Book from "../db/book";

export const bookList = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token) {
    return res.status(403).json({ error: true, message: "Not Authorized" });
  }
  const bookList = await Book.find(
    { userId: token },
    {
      _id: 1,
      title: 1,
      title_url: 1,
      author: 1,
      translator: 1,
      publisher: 1,
      subject: 1,
      ea_isbn: 1,
    }
  ).sort({ updatedAt: "desc" });
  res
    .status(200)
    .json({ error: false, bookList, message: "Successful Response" });
};

export const savedBookInfo = async (req: Request, res: Response) => {
  const { token } = req.query;
  const {
    publisher,
    author,
    translator,
    title_url,
    ea_isbn,
    subject,
    title,
    publisher_predate,
    start_date,
    end_date,
    review,
  } = req.body;
  if (!token) {
    return res.status(403).json({ error: true, message: "Not Authorized" });
  }
  await Book.create({
    userId: token,
    publisher,
    author,
    translator,
    title_url,
    ea_isbn,
    subject,
    title,
    publisher_predate,
    start_date,
    end_date,
    review,
  }).catch((e) => {
    return res.status(400).json({ error: true, message: `Error : ${e}` });
  });
  return res.status(201).json({ error: false, message: "Successful Upload" });
};

export const getBookInfoByIsbn = async (req: Request, res: Response) => {
  const { token, isbn } = req.query;
  if (!token || !isbn) {
    return res.status(401).json({ error: true, message: `Not Authorization` });
  }
  const bookInfo = await Book.findOne({
    userId: token,
    ea_isbn: isbn,
  });
  if (!bookInfo) {
    return res
      .status(404)
      .json({ error: true, message: "Not found this ISBN" });
  }
  return res
    .status(201)
    .json({ error: false, bookInfo, message: "Successful Sends" });
};

export const updateBookInfoByIsbn = async (req: Request, res: Response) => {
  const { token, isbn } = req.query;
  if (!token || !isbn) {
    return res.status(401).json({ error: true, message: `Not Authorization` });
  }
  const {
    body: { review, start_date, end_date },
  } = req.body;
  const bookInfo = await Book.findOne({
    userId: token,
    ea_isbn: isbn,
  });
  if (!bookInfo) {
    return res
      .status(404)
      .json({ error: true, message: "Not found this ISBN" });
  }
  await bookInfo.updateOne(
    {
      $set: {
        review,
        start_date,
        end_date,
        updatedAt: Date.now(),
      },
    },
    { new: true }
  );
  return res.status(201).json({ error: false, message: "Successful Updates" });
};

export const checkBookByIsbn = async (req: Request, res: Response) => {
  const { token, isbn } = req.query;
  if (!token || !isbn) {
    return res.status(401).json({ error: true, message: `Not Authorization` });
  }
  const bookInfo = await Book.findOne({
    userId: token,
    ea_isbn: isbn,
  });
  if (!bookInfo) {
    return res
      .status(200)
      .json({ hasBook: false, message: "No has this book" });
  }
  return res
    .status(200)
    .json({ hasBook: true, bookInfo, message: "Has this book" });
};

export const deleteBookByIsbn = async (req: Request, res: Response) => {
  const { token, isbn } = req.query;
  const bookInfo = await Book.findOneAndDelete({
    userId: token,
    ea_isbn: isbn,
  });
  if (!bookInfo) {
    return res.status(400).json({ error: true, message: "Bad Request" });
  }
  return res.status(204).json({ error: false, message: "Successful Delete" });
};
