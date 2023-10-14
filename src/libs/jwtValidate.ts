import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const JWT_TOKEN_SALT = process.env.JWT_SECRET;
export const REFRESH_EXPIRES_IN = 60 * 60 * 24 * 7 * 1000;
export const ACCESS_EXPIRES_IN = REFRESH_EXPIRES_IN / 7;

export const createRefreshToken = ({ id, username }: Userinfo) => {
  return jwt.sign({ id, username }, JWT_TOKEN_SALT, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};

export const createAccessToken = (id: string) => {
  return jwt.sign({ id }, JWT_TOKEN_SALT, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_TOKEN_SALT);
};

export const checkedToken: CheckedToken = (token) => {
  try {
    const verifiedToken = verifyToken(token);
    if (
      typeof verifiedToken !== "string" &&
      verifiedToken.exp * 1000 > Date.now()
    ) {
      return {
        id: verifiedToken.id,
        username: verifiedToken.username,
      };
    }
  } catch (_) {
    return false;
  }
};

export const revalidateAccessToken: RevalidateAccessToken = (refreshToken) => {
  const checkedRefreshToken = checkedToken(refreshToken);
  if (!checkedRefreshToken) {
    return null;
  }
  return {
    newToken: createAccessToken(checkedRefreshToken.id),
    userId: checkedRefreshToken.id,
    username: checkedRefreshToken.username,
  };
};

type Userinfo = {
  id: string;
  username: string;
};

type CheckedToken = (token: string) => Userinfo | false;
type RevalidateAccessToken = (
  refreshToken: string
) => { newToken: string; userId: string; username: string } | null;
