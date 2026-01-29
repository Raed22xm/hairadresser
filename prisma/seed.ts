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
        update: {
            salonName: 'Frisør Glostrup',
            address: 'Hovedvejen 139, st. 3, 2600 Glostrup',
        },
        create: {
            name: 'Maria Hansen',
            salonName: 'Frisør Glostrup',
            email: 'admin@hairadresser.dk',
            phone: '+45 12 34 56 78',
            address: 'Hovedvejen 139, st. 3, 2600 Glostrup',
            passwordHash,
        },
    })

    console.log('✅ Created hairdresser:', hairdresser.name)

    // Create services
    const services = await Promise.all([
        prisma.service.upsert({
            where: { id: 'service-haircut' },
            update: {
                name: 'Herreklip',
                description: 'Klassisk klip inkl. vask og styling',
                imageUrl: '/man-fade.png',
            },
            create: {
                id: 'service-haircut',
                hairdresserId: hairdresser.id,
                name: 'Herreklip',
                description: 'Klassisk klip inkl. vask og styling',
                durationMinutes: 30,
                price: 250,
                imageUrl: '/man-fade.png',
                isActive: true,
            },
        }),
        prisma.service.upsert({
            where: { id: 'service-color' },
            update: {
                name: 'Hårfarvning',
                description: 'Helfarvning med premium produkter',
                imageUrl: '/man-crop.png',
            },
            create: {
                id: 'service-color',
                hairdresserId: hairdresser.id,
                name: 'Hårfarvning',
                description: 'Helfarvning med premium produkter',
                durationMinutes: 60,
                price: 500,
                imageUrl: '/man-crop.png',
                isActive: true,
            },
        }),
        prisma.service.upsert({
            where: { id: 'service-styling' },
            update: {
                name: 'Styling',
                description: 'Professionel styling til enhver lejlighed',
                imageUrl: '/man-sidepart.png',
            },
            create: {
                id: 'service-styling',
                hairdresserId: hairdresser.id,
                name: 'Styling',
                description: 'Professionel styling til enhver lejlighed',
                durationMinutes: 45,
                price: 300,
                imageUrl: '/man-sidepart.png',
                isActive: true,
            },
        }),
        // New Services
        prisma.service.upsert({
            where: { id: 'service-child' },
            update: {
                name: 'Børneklip',
                description: 'Klipning for børn under 12 år',
                imageUrl: '/service-child.jpg',
            },
            create: {
                id: 'service-child',
                hairdresserId: hairdresser.id,
                name: 'Børneklip',
                description: 'Klipning for børn under 12 år',
                durationMinutes: 30,
                price: 200,
                imageUrl: '/service-child.jpg',
                isActive: true,
            },
        }),
        prisma.service.upsert({
            where: { id: 'service-pensioner' },
            update: {
                name: 'Pensionistklip',
                description: 'Rabat til pensionister',
                imageUrl: '/service-pensioner.jpg',
            },
            create: {
                id: 'service-pensioner',
                hairdresserId: hairdresser.id,
                name: 'Pensionistklip',
                description: 'Rabat til pensionister',
                durationMinutes: 30,
                price: 200,
                imageUrl: '/service-pensioner.jpg',
                isActive: true,
            },
        }),
        prisma.service.upsert({
            where: { id: 'service-women' },
            update: {
                name: 'Dameklip',
                description: 'Klipning og styling for kvinder',
                imageUrl: '/service-women.jpg',
            },
            create: {
                id: 'service-women',
                hairdresserId: hairdresser.id,
                name: 'Dameklip',
                description: 'Klipning og styling for kvinder',
                durationMinutes: 45,
                price: 400,
                imageUrl: '/service-women.jpg',
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
