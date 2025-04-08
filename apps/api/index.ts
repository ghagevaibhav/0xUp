import 'dotenv/config' 
import express, { type Request, type Response, type NextFunction } from "express";
import { prisma } from "db/client";
import cors from "cors";
import { authMiddleware } from './middleware';
const app = express();

app.use(express.json());
app.use(cors());

// Extend the Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface Error {
    stack: string;
}

app.post("/api/v1/website", authMiddleware(), async (req, res) => {
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

app.get("/api/v1/website/status", authMiddleware(), async (req, res) => {
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

app.get("/api/v1/websites", authMiddleware(), async (req, res) => {
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

app.delete("/api/v1/website", authMiddleware(), async (req, res) => {
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
    console.error(err.stack);
    res.status(401).send('Unauthenticated!');
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
