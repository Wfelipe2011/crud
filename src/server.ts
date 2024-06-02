import "dotenv/config";

import express, { Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { middleware } from "./middleware";
import { getParticipants } from "./getParticipants";
import { createOrUpdateParticipant } from "./createOrUpdateParticipant";

import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { prisma } from "./prismaClient";
import { createParticipantWithGroup } from "createParticipantWithGroup";

const app = express();

app.use(cors());
app.use(express.static("front/dist"));
app.use(bodyParser.json());

app.get("/participants", middleware, getParticipants);
app.post("/participants", middleware, createOrUpdateParticipant);
app.post("/participants-groups", middleware, createParticipantWithGroup);

app.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "front/dist" });
});

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "participants-photo",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: async function (req: Request, file, cb) {
      console.log({ file });
      if (!req.params["id"]) {
        cb(new Error("No id provided"));
        return;
      }
      const key = req.params["id"] + ".png";
      const urlBase = `https://participants-photo.s3.amazonaws.com/${key}`;
      await prisma.participants
        .update({
          where: {
            id: req.params.id,
          },
          data: {
            profile_photo: urlBase,
          },
        })
        .catch((e) => {
          console.error(e);
          cb(e);
        });
      cb(null, key);
    },
  }),
});

app.post("/upload/:id", upload.array("file", 3), async function (req, res) {
  res.send("Successfully uploaded " + req.files.length + " files!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
