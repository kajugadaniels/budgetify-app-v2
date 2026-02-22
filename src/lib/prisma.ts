import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

let cachedImportError: Error | null = null;

export async function getPrisma() {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;
    if (cachedImportError) throw cachedImportError;

    try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        if (process.env.NODE_ENV !== "production") {
            globalForPrisma.prisma = prisma;
        }

        return prisma;
    } catch (error) {
        cachedImportError =
            error instanceof Error
                ? new Error(
                      `Prisma Client is missing. Run Prisma generate/db push on Node 20/22. Original error: ${error.message}`
                  )
                : new Error("Prisma Client is missing. Run Prisma generate/db push.");
        throw cachedImportError;
    }
}
