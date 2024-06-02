import { Request, Response } from "express";
import { prisma } from "./prismaClient";
import { ParticipantProfile, ParticipantSex } from "@prisma/client";
import { createHash } from "crypto";

export class ParticipantUtils {
  static calculateComputedField({ name, phone }: { name: string; phone: string }) {
    return `${name} ${phone}`;
  }
}

export class LoginUtils {
  static encryptPassword(password: string): string {
    const hash = createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
  }
}

export const createParticipantWithGroup = async (req: Request, res: Response) => {
  try {
    if (req.body.group === "Quarta-feira (Manhã)") {
      res.send({ message: "Group not allowed" });
      return;
    }
    const body = req.body;
    body.computed = ParticipantUtils.calculateComputedField(body);
    await prisma.$transaction(async (txt) => {
      const group = await txt.groups.findFirst({
        where: {
          name: body.group,
        },
      });
      const { ...data } = body;
      const participant = await txt.participants.create({
        data: {
          name: data.name,
          email: data.email,
          phone: String(data.phone),
          sex: ParticipantSex.FEMALE === data.gender.toUpperCase() ? ParticipantSex.FEMALE : ParticipantSex.MALE,
          computed: data.computed,
          profile: ParticipantProfile.PARTICIPANT,
          profile_photo: data.photo,
          Auth: {
            create: {
              password: LoginUtils.encryptPassword("123456"),
            },
          },
        },
      });
      await txt.participantsGroups.create({
        data: {
          participantId: participant.id,
          groupId: group.id,
        },
      });
    });

    res.send({ message: `Participant ${body.id ? "updated" : "created"} successfully` });
  } catch (error) {
    console.log(error.message);
    res.send({ message: "Internal server error" });
  }
};
