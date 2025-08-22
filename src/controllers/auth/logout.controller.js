import { UserModel } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const logoutUser = asyncHandler(async (req, res) => {
  // get userId from req.user <- through jwt verification
  // Remove user refresh token from DB
  // clear cookies
  const userId = req.user._id;

  await UserModel.findByIdAndUpdate(
    userId,
    {
      $unset: {
        // this remove the field from database
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const cookiesOptions = {
    httpOnly: true, // it says only server or HTTP only modify the cookies token
    secure: true,
  };

  return res
    .status(200)
    .clearCookies("accessToken", cookiesOptions)
    .clearCookies("refreshToken", cookiesOptions)
    .json(new ApiResponse(200, {}, "Logged Out successfully"));
});

export { logoutUser };
