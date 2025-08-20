import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

var whitelist = [process.env.CORS_ORIGIN, "http://localhost:5173"];

app.use(
  cors({
    origin: whitelist,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // Allows json and limit of the json file size
app.use(express.urlencoded({ extended: true })); // parses incoming URL-encoded form data (like data submitted via HTML forms).
app.use(express.static("public")); // This serves static files (images, CSS, PDFs, etc.) directly from the public/ folder.
app.use(cookieParser()); // Allows read cookies sent by the client and also send cookies back.
