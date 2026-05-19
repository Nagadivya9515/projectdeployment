import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.patch("/update/:itemId", cartController.updateCart);
router.delete("/clear", cartController.clearCart);

export default router;