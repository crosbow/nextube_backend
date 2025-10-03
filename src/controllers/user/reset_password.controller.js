import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const resetPassword = asyncHandler(async (req, res) => {
  /**
      -> Get old password and new password from frontend
      -> check if both are same? if same throw err
      -> check old password is correct 
      -> inject new password and save
      -> return response
     */

  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return res.status(400).json(new ApiError(400, "Please enter new password"));
  }

  const user = await UserModel.findById(req.user._id);

  const isPasswordMatched = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordMatched) {
    return res.status(400).json(new ApiError(400, "Password is incorrect"));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export { resetPassword };
