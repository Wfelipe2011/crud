import { Request, Response } from "express";
import { prisma } from "./prismaClient";

export const getParticipants = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query as { filter: string; page: string };
    const page = parseInt(queryParams.page || "1") - 1;

    const [groups, participants, count] = await Promise.all([
      prisma.groups.findMany(),
      prisma.participants.findMany({
        where: {
          ...(queryParams.filter && {
            computed: {
              contains: queryParams.filter.toLowerCase(),
              mode: "insensitive",
            },
          }),
        },
        include: {
          ParticipantsGroup: {
            include: {
              group: true,
            },
          },
        },
        skip: page * 10,
        take: 10,
      }),
      prisma.participants.count({
        where: {
          ...(queryParams.filter && {
            computed: {
              contains: queryParams.filter.toLowerCase(),
              mode: "insensitive",
            },
          }),
        },
      }),
    ]);

    const pages = {
      total: Math.ceil(count / 10),
      current: parseInt(queryParams.page),
      next: parseInt(queryParams.page) + 1,
      previous: parseInt(queryParams.page) - 1,
    };

    res.send({
      participants: participants.map((p) => {
        const { ParticipantsGroup, ...rest } = p;
        return {
          ...rest,
          group: ParticipantsGroup[0]?.group,
        };
      }),
      pages,
      groups,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
