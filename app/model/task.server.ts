import { PrismaClient } from "@prisma/client";
import { getUserId } from "./user.server";

const prisma = new PrismaClient();

export async function getTasks(request) {
  return prisma.task.findMany({
    where: { id: await getUserId(request) },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true },
  });
}
export async function getColumn() {
  return prisma.columns.findMany();
}
export async function getToDoTasks(request) {
    return prisma.task.findMany({
        where: { UserId: await getUserId(request)  , ColumnsId:"6c17b236-cfbc-418c-9883-9f737ec8065b" },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true },
      });
}