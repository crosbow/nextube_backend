import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const generateAccessAndRefreshToken = async (userId) => {
  // get user by userId
  // call access and refresh token methods from user.model.js
  // update user refresh token in database
  // finally return both tokens
  try {
    const user = await UserModel.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    // validateBeforeSave: false - when update user by .save() method don't validate other fields
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token."
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // get value from frontend - username or email, password
  // validate empty field
  // check user exist or not
  // validate password
  // generate access and refresh token |
  // save refresh token on db         |
  // send response with access and refresh token and user data

  const { username, email, password } = req.body;

  if (!email && !username) {
    return res
      .status(400)
      .json(new ApiError(400, "Please provide email or username"));
  }

  if (!password) {
    return res.status(400).json(new ApiError(400, "Password is required!"));
  }

  const user = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res
      .status(404)
      .json(new ApiError(404, "User not found with this credential"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(404)
      .json(new ApiError(400, "User not found with this credential"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Return without password (subtract) and  refreshToken
  const loggedInUser = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User loggedIn successfully"
      )
    );
});

export { loginUser };
