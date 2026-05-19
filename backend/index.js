import { Router } from "express";
import packageRouter from "./routers/package.router.js";
import productRouter from "./routers/product.router.js";
import cartRouter from "./routers/cart.router.js";
import bookingRouter from "./routers/booking.router.js";
import authRouter from "./routers/auth.router.js";
const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/packages", packageRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/bookings", bookingRouter);

export default rootRouter;