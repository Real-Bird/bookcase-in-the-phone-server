import { Router } from "express";
import * as bookcaseCtrl from "../controller/bookcase";

const router = Router();

router.get("/list", bookcaseCtrl.getToken, bookcaseCtrl.bookList);

router.post("/info", bookcaseCtrl.getToken, bookcaseCtrl.savedBookInfo);

router.get("/info", bookcaseCtrl.getToken, bookcaseCtrl.getBookInfoByIsbn);

router.patch("/info", bookcaseCtrl.getToken, bookcaseCtrl.updateBookInfoByIsbn);

router.delete("/info", bookcaseCtrl.getToken, bookcaseCtrl.deleteBookByIsbn);

router.get("/check", bookcaseCtrl.getToken, bookcaseCtrl.checkBookByIsbn);

export default router;
