import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Client } from 'pg';
import { plainToClass, plainToInstance } from 'class-transformer';
import { GetUserDto } from '../dto/get-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject('PG_CONNECTION') private client: Client) {}

  async findAll(
    page: number,
    pageSize: number,
    search?: string,
  ): Promise<{ users: GetUserDto[]; totalPages: number; totalCount: number }> {
    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) FROM users';
    const values: Array<string | number> = [];

    if (search) {
      query += ` WHERE name ILIKE $1 OR surname ILIKE $1`;
      countQuery += ` WHERE name ILIKE $1 OR surname ILIKE $1`;
      values.push(`%${search}%`);
    }

    // ID'ye göre sıralama ekleniyor
    query += ` ORDER BY id ASC`;

    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(pageSize, (page - 1) * pageSize);

    const { rows } = await this.client.query(query, values);
    const countResult = await this.client.query(
      countQuery,
      search ? [`%${search}%`] : [],
    );
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / pageSize);

    const users = plainToInstance(GetUserDto, rows);

    return {
      users,
      totalPages,
      totalCount,
    };
  }

  async findOne(id: number): Promise<GetUserDto> {
    const { rows } = await this.client.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    if (rows.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return plainToClass(GetUserDto, rows[0]);
  }

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const {
      name,
      surname,
      email,
      password,
      phone,
      age,
      country,
      district,
      role,
    } = createUserDto;

    const emailCheck = await this.client.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    if (emailCheck.rows.length > 0) {
      throw new ConflictException('Email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows } = await this.client.query(
      'INSERT INTO users (name, surname, email, password, phone, age, country, district, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        name,
        surname,
        email,
        hashedPassword,
        phone,
        age,
        country,
        district,
        role || 'user',
      ],
    );
    return plainToClass(GetUserDto, rows[0]);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const existingUser = await this.findOne(id);

    const {
      name,
      surname,
      email,
      password,
      phone,
      age,
      country,
      district,
      role,
    } = updateUserDto;

    if (email && email !== existingUser.email) {
      const emailCheck = await this.client.query(
        'SELECT * FROM users WHERE email = $1',
        [email],
      );
      if (emailCheck.rows.length > 0) {
        throw new ConflictException('Email already exists.');
      }
    }

    let hashedPassword = existingUser.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const { rows } = await this.client.query(
      'UPDATE users SET name = $1, surname = $2, email = $3, password = $4, phone = $5, age = $6, country = $7, district = $8, role = $9 WHERE id = $10 RETURNING *',
      [
        name || existingUser.name,
        surname || existingUser.surname,
        email || existingUser.email,
        hashedPassword,
        phone || existingUser.phone,
        age || existingUser.age,
        country || existingUser.country,
        district || existingUser.district,
        role || existingUser.role,
        id,
      ],
    );

    return plainToClass(GetUserDto, rows[0]);
  }

  async remove(id: number): Promise<DeleteUserDto> {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    await this.client.query('DELETE FROM users WHERE id = $1', [id]);
    return plainToClass(DeleteUserDto, { id });
  }
}
