import { Router } from "express";
import * as bookcaseCtrl from "../controller/bookcase";

const router = Router();

router.get("/list", bookcaseCtrl.bookList);

router.post("/info", bookcaseCtrl.savedBookInfo);

router.get("/info", bookcaseCtrl.getBookInfoByIsbn);

router.patch("/info", bookcaseCtrl.updateBookInfoByIsbn);

router.delete("/info", bookcaseCtrl.deleteBookByIsbn);

router.get("/check", bookcaseCtrl.checkBookByIsbn);

export default router;
