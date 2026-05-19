import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// Public route
router.get("/", productController.getProducts);

// Protected routes (Admin/Manager only)
router.use(authMiddleware);
router.use(roleMiddleware("admin")); 

router.post("/", productController.addProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;