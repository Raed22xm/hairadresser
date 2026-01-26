import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Seeding database...')

    // Create hairdresser (admin)
    const passwordHash = await bcrypt.hash('admin123', 10)

    const hairdresser = await prisma.hairdresser.upsert({
        where: { email: 'admin@hairadresser.dk' },
        update: {},
        create: {
            name: 'Maria Hansen',
            salonName: 'Hairadresser Salon',
            email: 'admin@hairadresser.dk',
            phone: '+45 12 34 56 78',
            address: 'Vestergade 123, 1234 Copenhagen',
            passwordHash,
        },
    })

    console.log('✅ Created hairdresser:', hairdresser.name)

    // Create services
    const services = await Promise.all([
        prisma.service.upsert({
            where: { id: 'service-haircut' },
            update: {},
            create: {
                id: 'service-haircut',
                hairdresserId: hairdresser.id,
                name: 'Haircut',
                description: 'Classic haircut with wash and styling',
                durationMinutes: 30,
                price: 250,
                isActive: true,
            },
        }),
        prisma.service.upsert({
            where: { id: 'service-color' },
            update: {},
            create: {
                id: 'service-color',
                hairdresserId: hairdresser.id,
                name: 'Hair Coloring',
                description: 'Full color treatment with premium products',
                durationMinutes: 60,
                price: 500,
                isActive: true,
            },
        }),
        prisma.service.upsert({
            where: { id: 'service-styling' },
            update: {},
            create: {
                id: 'service-styling',
                hairdresserId: hairdresser.id,
                name: 'Styling',
                description: 'Professional styling for any occasion',
                durationMinutes: 45,
                price: 300,
                isActive: true,
            },
        }),
    ])

    console.log('✅ Created services:', services.length)

    // Create weekly availability (Monday-Saturday)
    const availability = []
    for (let day = 1; day <= 6; day++) {
        const startTime = day === 6 ? '10:00' : '09:00'
        const endTime = day === 6 ? '14:00' : '17:00'

        availability.push(
            prisma.availability.upsert({
                where: {
                    hairdresserId_dayOfWeek: {
                        hairdresserId: hairdresser.id,
                        dayOfWeek: day
                    }
                },
                update: {},
                create: {
                    hairdresserId: hairdresser.id,
                    dayOfWeek: day,
                    startTime,
                    endTime,
                    isAvailable: true,
                },
            })
        )
    }

    // Sunday - closed
    availability.push(
        prisma.availability.upsert({
            where: {
                hairdresserId_dayOfWeek: {
                    hairdresserId: hairdresser.id,
                    dayOfWeek: 0
                }
            },
            update: {},
            create: {
                hairdresserId: hairdresser.id,
                dayOfWeek: 0,
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: false,
            },
        })
    )

    await Promise.all(availability)
    console.log('✅ Created availability for all days')

    console.log('🎉 Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end()
    })
