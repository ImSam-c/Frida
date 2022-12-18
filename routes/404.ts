import { Router } from "express";
import path from "node:path";

const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/img/404.png"));
});

export default router;
