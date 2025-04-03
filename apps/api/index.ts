import 'dotenv/config' 
import express, { type Request, type Response } from "express";
import { prisma } from "db/client";
import { authMiddleware } from "./middleware";
import cors from "cors";
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
const app = express();

app.use(express.json());
app.use(cors());
app.use(authMiddleware);

interface Error {
    stack: string;
}

app.post("/api/v1/website", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;

  const data = await prisma.website.create({
    data: {
      userId,
      url,
    },
  });

  res.json({
    id: data.id,
    message: "Website created successfully",
  });
});

app.get("/api/v1/website/status", async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const userId = req.userId!;
  const data = await prisma.website.findFirst({
    where: {
      id: websiteId,
      userId,
    },
    include: {
      ticks: true,
    },
  });

  res.json(data);
});

app.get("/api/v1/websites", async (req, res) => {
  const userId = req.userId!;
  const websites = await prisma.website.findMany({
    where: {
      userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });

  res.json({ websites });
});

app.delete("/api/v1/website", async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const userId = req.userId!;
  const data = await prisma.website.update({
    where: {
      id: websiteId,
      userId,
    },
    data: {
      disabled: true,
    },
  });

  res.json(data);
});

app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
  })

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
