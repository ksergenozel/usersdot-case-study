import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

dotenv.config();

@Module({
  providers: [
    {
      provide: 'PG_CONNECTION',
      useFactory: async () => {
        const client = new Client({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
        });

        console.log('Connecting to PostgreSQL...');

        await client.connect();
        console.log('Connected to PostgreSQL!');

        const result = await client.query(
          `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_DATABASE}'`,
        );

        if (result.rowCount === 0) {
          console.log(
            `Database ${process.env.DB_DATABASE} does not exist. Creating...`,
          );
          await client.query(`CREATE DATABASE ${process.env.DB_DATABASE}`);
          console.log(
            `Database ${process.env.DB_DATABASE} created successfully!`,
          );
        } else {
          console.log(`Database ${process.env.DB_DATABASE} already exists.`);
        }

        await client.end();
        console.log('Initial connection closed.');

        const dbClient = new Client({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        });

        await dbClient.connect();
        console.log('Connected to the target database.');

        return dbClient;
      },
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@Inject('PG_CONNECTION') private client: Client) {}

  async onModuleInit() {
    console.log('Running seed process...');

    await this.client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        surname VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(255),
        age INT,
        country VARCHAR(255),
        district VARCHAR(255),
        role VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Users table created or already exists.');

    const result = await this.client.query('SELECT * FROM users');
    if (result.rowCount === 0) {
      console.log('Seeding database with mock users...');

      const users = [];

      for (let i = 0; i < 100; i++) {
        const plainPassword = faker.internet.password();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        users.push({
          name: faker.person.firstName(),
          surname: faker.person.lastName(),
          email: faker.internet.email(),
          password: hashedPassword,
          phone: faker.phone.number(),
          age: faker.number.int({ min: 18, max: 80 }),
          country: faker.location.country(),
          district: faker.location.city(),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      const query = `
        INSERT INTO users (name, surname, email, password, phone, age, country, district, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

      for (const user of users) {
        await this.client.query(query, [
          user.name,
          user.surname,
          user.email,
          user.password,
          user.phone,
          user.age,
          user.country,
          user.district,
          user.role,
          user.createdAt,
          user.updatedAt,
        ]);
      }

      console.log('Mock users created successfully!');
    } else {
      console.log('Users already exist, skipping seeding.');
    }
  }
}
