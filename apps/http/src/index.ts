import express from "express";
import cors from "cors";
import { ApiResponse } from "./utils/apiResponse";

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));

app.get("/health", (_req, res) => {
  return res.json(
    new ApiResponse(200, {
      message: "server is healthy",
    }),
  );
});

import authRouter from "./routes/auth.route";
import { errMiddleware } from "./middlewares/global_error_handler";

app.use("/auth", authRouter);

app.use(errMiddleware);

app.listen(PORT, () => {
  console.log("server started");
});
