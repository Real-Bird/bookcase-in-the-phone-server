import { config } from "dotenv";
import express from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import authRouter from "./routes/auth";
import bookcaseRouter from "./routes/bookcase";

config();

declare global {
  namespace Express {
    interface User {
      name: string;
      id: string;
    }
  }
}

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const corsOptions: cors.CorsOptions = {
  origin: process.env.ALLOW_ORIGIN,
  credentials: true,
  allowedHeaders: "Content-Type, Authorization",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/bookcase", bookcaseRouter);

app.get("/", (req, res) => {
  res.redirect(process.env.ALLOW_ORIGIN);
});

export default app;
