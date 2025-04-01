import express from "express";
import { prisma } from "db/client";
import { authMiddleware } from "./middleware";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(authMiddleware);

app.post("/api/v1/website", async (req, res) => {
    const userId = req.userId!;
    const { url } = req.body;

    const data = await prisma.website.create({
        data:  {
            userId,
            url
        }
    })

    res.json({
        id: data.id
    })
});

app.get("/api/v1/website/status", async (req, res) => {
    const websiteId = req.query.websiteId as string;
    const userId = req.userId!;  
    const data = await prisma.website.findFirst({
        where: {
            id: websiteId,
            userId
        },
        include: {
            ticks: true
        } 
    })

    res.json(data)
});

app.get("/api/v1/websites", async (req, res) => {
    const userId = req.userId!;
    const websites = await prisma.website.findMany({
        where: {
            userId,
            disabled: false
        }, 
        include: {
            ticks: true
        }
    })

    res.json({websites})
});

app.delete("/api/v1/website", async (req, res) => {
    const websiteId = req.query.websiteId as string;
    const userId = req.userId!;  
    const data = await prisma.website.update({
        where: {
            id: websiteId,
            userId
        },
        data: {
            disabled: true
        }
    })

    res.json(data)
});

app.listen(8080);