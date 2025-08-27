import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  // get token from cookie or header(authorization) and check
  // validate token via jwt.verify
  // if token NOT okay then throw unauthorized error
  // if token is okay and user is exist by the token info _id then return okay otherwise throw error

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer", ""); // remove "Bearer" keyword from the token by ""

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await UserModel.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});

export { verifyJWT };
