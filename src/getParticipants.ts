import { Request, Response } from "express";
import { prisma } from "./prismaClient";

export const getParticipants = async (req: Request, res: Response) => {
  const queryParams = req.query as { filter: string; page: string };
  const page = parseInt(queryParams.page || "1") - 1;
  const groups = await prisma.groups.findMany();

  const participants = await prisma.participants.findMany({
    where: {
      ...(queryParams.filter && {
        computed: {
          contains: queryParams.filter.toLowerCase(),
          mode: "insensitive",
        },
      }),
    },
    include: {
      Groups: true,
    },
    skip: page * 10,
    take: 10,
  });

  const count = await prisma.participants.count({
    where: {
      ...(queryParams.filter && {
        computed: {
          contains: queryParams.filter.toLowerCase(),
          mode: "insensitive",
        },
      }),
    },
  });

  const pages = {
    total: Math.ceil(count / 10),
    current: parseInt(queryParams.page),
    next: parseInt(queryParams.page) + 1,
    previous: parseInt(queryParams.page) - 1,
  };

  res.send({
    participants: participants.map((p) => {
      const { Groups, ...rest } = p;
      return {
        ...rest,
        group: Groups.length ? Groups[0] : null,
      };
    }),
    pages,
    groups,
  });
};
