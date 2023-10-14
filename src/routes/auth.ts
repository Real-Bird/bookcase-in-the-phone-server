import { Router } from "express";
import * as authCtrl from "../controller/auth";

const router = Router();

router.get("/login", authCtrl.login);

router.get("/logout", authCtrl.logout);

router.get("/disconnect", authCtrl.disconnect);

router.get("/google", authCtrl.reqGoogle);

router.get(
  "/google/callback",
  authCtrl.callbackGoogle,
  authCtrl.saveGoogleUserInfo
);

router.get("/check", authCtrl.check);

export default router;
