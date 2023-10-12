import { Request, Response, NextFunction } from "express";
import Books from "../db/book";
import { checkedToken, revalidateAccessToken } from "../libs/jwtValidate";

const REFRESH_TOKEN_KEY = "bip-rf-token" as const;

export const getToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: "Not found access token" });
  }
  const verifiedToken = checkedToken(token);
  let revalidatedToken;
  if (!verifiedToken) {
    revalidatedToken = revalidateAccessToken(req.cookies[REFRESH_TOKEN_KEY]);
    if (!revalidatedToken) {
      return res.status(403).json({
        error: true,
        message: "Your refresh token is not available",
      });
    }
  }
  req.user = {
    id: verifiedToken ? verifiedToken.id : revalidatedToken.userId,
    name: verifiedToken ? verifiedToken.username : revalidatedToken.username,
  };
  next();
};

export const bookList = async (req: Request, res: Response) => {
  const bookList = await Books.find(
    { userId: req.user.id },
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
  await Books.create({
    userId: req.user.id,
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
  const { isbn } = req.query;
  if (!isbn) {
    return res
      .status(400)
      .json({ error: true, message: "We need the ISBN number" });
  }
  const bookInfo = await Books.findOne({
    userId: req.user.id,
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
  const { isbn } = req.query;
  if (!isbn) {
    return res
      .status(401)
      .json({ error: true, message: "We need the ISBN number" });
  }
  const {
    body: { review, start_date, end_date },
  } = req.body;
  const bookInfo = await Books.findOne({
    userId: req.user.id,
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
  const { isbn } = req.query;
  if (!isbn) {
    return res
      .status(401)
      .json({ error: true, message: "We need the ISBN number" });
  }
  const bookInfo = await Books.findOne({
    userId: req.user.id,
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
  const { isbn } = req.query;
  const bookInfo = await Books.findOneAndDelete({
    userId: req.user.id,
    ea_isbn: isbn,
  });
  if (!bookInfo) {
    return res.status(400).json({ error: true, message: "Bad Request" });
  }
  return res.status(204).json({ error: false, message: "Successful Delete" });
};
