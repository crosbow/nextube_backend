/**
    What actually this controller/route does?

    -> When the user accessToken expires without reLogin the user get the status code (401 unauthorized) and hit this route to refresh user accessToken and give user access again without hassle. 

    This makes the performance good.
    Whenever refresh the token, both accessToken and refresh token reGenerated
    By that way Frontend engineer set access and refresh token in cookies or localstorage. 
    that's all.
 */

import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessAndRefreshToken } from "./login.controller.js";

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.body?.refreshToken ||
    req.header("refreshToken") ||
    req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }

  // verify refresh token
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await UserModel.findById(decodedToken?._id);

  if (!user) {
    return res.status(401).json(new ApiError(401, "Invalid refresh token"));
  }

  if (incomingRefreshToken !== user.refreshToken) {
    return res.status(401).json(new ApiError(401, "Invalid refresh token"));
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const cookiesOptions = {
    httpOnly: true, // it says only server (or HTTP) modify the cookies token
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", newRefreshToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Refresh token token successfully"
      )
    );
});

export { refreshAccessToken };
