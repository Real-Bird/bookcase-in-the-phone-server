import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "dotenv";
import Users from "../db/user";

config();

export default function callPassport() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const userInfo = await Users.findOne({ id });
    done(null, userInfo);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? process.env.GOOGLE_CALLBACK_URL
            : "/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const { sub, name, email } = profile._json;
        const user = await Users.findOne({ id: sub });
        if (user) {
          done(null, user);
        } else {
          const newUser = await Users.create({ id: sub, name, email });
          done(null, newUser);
        }
      }
    )
  );

  return passport;
}
