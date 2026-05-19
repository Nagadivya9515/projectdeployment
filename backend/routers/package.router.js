// routers/package.router.js
import { Router } from "express";
import * as packageController from "../controllers/package.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const packageRouter = Router();

// ─── Public routes (anyone can read) ─────────────────────────
packageRouter.get("/",               packageController.getAllPackages);
packageRouter.get("/:slug/types",    packageController.getTypesBySlug);  // ✅ specific BEFORE dynamic
packageRouter.get("/:slug",          packageController.getPackageBySlug);

// ─── Protected routes (manager only) ─────────────────────────
packageRouter.use(authMiddleware);              // all routes below require login
packageRouter.use(roleMiddleware("manager"));   // all routes below require manager role

packageRouter.post("/",              packageController.createPackage);
packageRouter.put("/:id",            packageController.updatePackage);
packageRouter.delete("/:id",         packageController.deletePackage);

// ─── Package types (also manager only) ───────────────────────
packageRouter.get("/types/:id",      packageController.getTypeById);
packageRouter.post("/types",         packageController.createPackageType);
packageRouter.put("/types/:id",      packageController.updatePackageType);
packageRouter.delete("/types/:id",   packageController.deletePackageType);

export default packageRouter;