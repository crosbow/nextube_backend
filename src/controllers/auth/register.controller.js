import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

// Take user details from frontend - done
// Validation - done
// Check already exists via - email, username - done
// Check files if not empty - avatar - done
// Upload file on cloudinary - done
// check cloudinary upload err and return
// create user object using create entry in DB
// Return response except password and refreshToken

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  const emptyField = [username, email, fullname, password].find(
    (field) => field.trim() === ""
  );

  if (emptyField) {
    throw new ApiError(400, `"${emptyField}" is required`);
  }

  const existedUser = await UserModel.findOne({
    $or: [{ username }, { email }], // $or is a mongoDB operator
  });

  if (existedUser) {
    throw new ApiError(409, `"User already exist with the username or email"`);
  }

  let avatarLocalFilePath;
  let coverImageLocalFilePath;

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar?.length > 0
  ) {
    avatarLocalFilePath = req.files.avatar[0].path;
  }

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage?.length > 0
  ) {
    coverImageLocalFilePath = req.files.coverImage[0].path;
  }

  if (!avatarLocalFilePath) {
    throw new ApiError(400, `avatar file is required`);
  }

  const avatar = await uploadOnCloudinary(avatarLocalFilePath);
  const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);

  if (!avatar) {
    throw new ApiError(500, `avatar file is required`);
  }

  const createNewUser = await UserModel.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
  });

  const user = await UserModel.findById(createNewUser._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export { registerUser };
