import "dotenv/config";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { middleware } from "./middleware";
import { getParticipants } from "./getParticipants";
import { createOrUpdateParticipant } from "./createOrUpdateParticipant";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());

app.get("/", middleware, (req, res) => {
  res.send("Hello World 123");
});

app.get("/participants", middleware, getParticipants);

app.post("/participants", middleware, createOrUpdateParticipant);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
