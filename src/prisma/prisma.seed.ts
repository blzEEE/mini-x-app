
import { PrismaClient } from '@prisma/client'
import { USERS } from './data/users.data'
import { hash } from 'argon2'

const prisma = new PrismaClient({
    transactionOptions: {
        isolationLevel: 'Serializable'
    }
})

async function main(){
    console.log('Seeding...')
    await prisma.$transaction([
        prisma.tag.deleteMany(),
        prisma.post.deleteMany(),
        prisma.user.deleteMany()
    ])
    await prisma.$transaction(async tx => {
        
        for(const user of USERS){
            await tx.user.create({
                data: {
                    username: user,
                    login: user,
                    password: await hash(user)
                }
            })
        }
    })

    console.log("Data seeded")
}

main()