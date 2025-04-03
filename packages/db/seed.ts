import { prisma } from "./src"
async function seed () {
    await prisma.user.create({
        data: {
            id: "1",
            email: "admin@0xup.com"
        }
    })

    const website = await prisma.website.create({
        data: {
            // id: "1",
            url: "https://www.0xup2.com",
            userId: "1" 
        }
    }) 

    const validator = await prisma.validator.create({
        data: {
            // id: "1",
            publicKey: "1",
            location: "Pune",
            ip: "127.0.0.1 ",
        }
    })

    await prisma.websiteTick.create({
        data: {
            // id: "1",
            websiteId: website.id,
            validatorId: validator.id,
            createdAt:  new Date(),
            status: "Up",
            latency: 60
        }
    })

    await prisma.websiteTick.create({
        data: {
            // id: "1",
            websiteId: website.id,
            validatorId: validator.id,
            createdAt:  new Date(Date.now() - 3 * 60 * 1000),
            status: "Down",
            latency: 40
        }
    })

    await prisma.websiteTick.create({
        data: {
            // id: "1",
            websiteId: website.id,
            validatorId: validator.id,
            createdAt:  new Date(Date.now() - 6 * 60 * 1000),
            status: "Up",
            latency: 10
        }
    })
}

seed();