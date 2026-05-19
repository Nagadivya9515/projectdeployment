import { ApiError } from "../utils/ApiError.js";

/**
 * @param {...String} roles - Allowed roles (e.g. 'admin', 'manager')
 */
export const roleMiddleware = (...roles) => {
    return (req, _, next) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403, 
                `Role: ${req.user.role} is not authorized to access this resource`
            );
        }

        next();
    };
};