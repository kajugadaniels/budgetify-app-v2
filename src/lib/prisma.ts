import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let cachedImportError: Error | null = null;

export async function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (cachedImportError) {
    throw cachedImportError;
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
    }

    return prisma;
  } catch (error) {
    cachedImportError =
      error instanceof Error
        ? new Error(
            `Prisma Client is not generated. Run a Prisma generate step after using a supported Node LTS (20 or 22). Original error: ${error.message}`
          )
        : new Error("Prisma Client is not generated. Run Prisma generate.");
    throw cachedImportError;
  }
}
