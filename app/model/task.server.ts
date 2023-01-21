import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export function getTasks()
{
    return prisma.task.findMany();
}