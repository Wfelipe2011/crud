import { Request, Response } from "express";
import { prisma } from "./prismaClient";

export class ParticipantUtils {
  static calculateComputedField({ name, phone }: { name: string; phone: string }) {
    return `${name} ${phone}`;
  }
}

export const createOrUpdateParticipant = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let participantId = body?.id;
    if (!body.groupId) {
      res.status(400).send({ message: "groupId is required" });
    }
    body.computed = ParticipantUtils.calculateComputedField(body);
    await prisma.$transaction(async (txt) => {
      if (body.id) {
        const { id, groupId, ...data } = body;
        await txt.participants.update({
          where: {
            id: body.id,
          },
          data,
        });
        await txt.participantsGroups.deleteMany({
          where: {
            participantId: body.id,
          },
        });
        await txt.participantsGroups.create({
          data: {
            participantId: body.id,
            groupId: groupId,
          },
        });
      } else {
        const { groupId, ...data } = body;
        const participant = await txt.participants.create({ data });
        participantId = participant.id;
        await txt.participantsGroups.create({
          data: {
            participantId: participant.id,
            groupId: groupId,
          },
        });
      }
    });

    res.send({ message: `Participant ${body.id ? "updated" : "created"} successfully`, participant: { id: participantId } });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal server error" });
  }
};
