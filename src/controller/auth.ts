import { CookieOptions, Request, Response } from "express";
import Users from "../db/user";
import callPassport from "../libs/passport";
import { config } from "dotenv";
import {
  REFRESH_EXPIRES_IN,
  checkedToken,
  createAccessToken,
  createRefreshToken,
  revalidateAccessToken,
  verifyToken,
} from "../libs/jwtValidate";

config();

const REFRESH_TOKEN_KEY = "bip-rf-token" as const;
const passport = callPassport();
const cookieOption: CookieOptions = {
  httpOnly: true,
  secure: true,
};

export const login = (req: Request, res: Response) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
  if (!refreshToken) {
    res
      .status(401)
      .json({ error: true, message: "Do not exist your refresh token" });
    return;
  }
  const checkedRefreshToken = checkedToken(refreshToken);
  if (!checkedRefreshToken) {
    res.status(403).json({ error: true, message: "Not Authorized" });
  } else {
    const accessToken = createAccessToken(checkedRefreshToken.id);

    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      accessToken,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  return req.logout(() => {
    res.status(204).end();
  });
};

export const check = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
  if (!refreshToken) {
    res
      .status(400)
      .json({ error: true, message: "Do not exist your refresh token" });
    return;
  }
  const checkedRefreshToken = checkedToken(refreshToken);
  if (!checkedRefreshToken) {
    res.status(400).json({ error: true, message: "Not Authorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: "Not found access token" });
  }
  const verifiedToken = checkedToken(token);
  let revalidatedToken;
  if (!verifiedToken) {
    revalidatedToken = revalidateAccessToken(refreshToken);
    if (!revalidatedToken) {
      return res
        .status(403)
        .json({ error: true, message: "Your refresh token is not available" });
    }
  }
  const user = await Users.findOne({
    id: verifiedToken ? verifiedToken.id : revalidatedToken.userId,
  });
  if (!user) {
    return res.status(401).json({ error: true, message: "Do not exist user" });
  }
  return res.status(200).json({
    error: false,
    message: "Successfully checked",
    userInfo: {
      username: user.name,
      newAccessToken: verifiedToken ? undefined : revalidatedToken.newToken,
    },
  });
};

export const reqGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const callbackGoogle = passport.authenticate("google", {
  session: false,
});

export const saveGoogleUserInfo = (req: Request, res: Response) => {
  const refreshToken = createRefreshToken({
    id: req.user.id,
    username: req.user.name,
  });
  res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
    ...cookieOption,
    maxAge: REFRESH_EXPIRES_IN * 1000,
  });
  res.status(200).redirect(`${process.env.ALLOW_ORIGIN}/login`);
};
