import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const updateDetails = asyncHandler(async (req, res) => {
  /**
     -> Take details from frontend, what to update? - fullname, email
     -> validate if empty - one field is required
     -> check old details with new details are same?
     -> if not, update user by new info 
     -> save and return response
     */

  const { fullname, email } = req.body;

  if (!fullname && !email) {
    return res.status(400).json(new ApiError(400, "all fields are required"));
  }

  const userId = req.user._id;

  const updatedField = async (fieldName, value) => {
    updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          [fieldName]: value,
        },
      },
      { new: true } // its return new user object with new data.
    ).select("-password -refreshToken");

    return updatedUser;
  };

  let updatedUser;

  if (fullname) {
    updatedUser = await updatedField("fullname", fullname);
  }

  if (email) {
    updatedUser = await updatedField("email", email);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedUser }, "User data updated successfully")
    );
});

export { updateDetails };
