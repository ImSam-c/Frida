import { Router } from "express";
import { uploadFile } from "../controllers/uploads";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

router.post("/", validateJWT, uploadFile);

export default router;
