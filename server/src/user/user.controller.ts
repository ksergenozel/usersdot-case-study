import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from '../dto/get-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string = '10',
    @Query('search') search?: string,
  ): Promise<{ users: GetUserDto[]; totalPages: number; totalCount: number }> {
    const pageNumber = parseInt(page, 10) || 1;
    const size = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || isNaN(size) || pageNumber < 1 || size < 1) {
      throw new BadRequestException('Invalid page or pageSize parameters');
    }

    return this.userService.findAll(pageNumber, size, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.findOne(+id);
  }

  @Post('save')
  async create(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return this.userService.create(createUserDto);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<DeleteUserDto> {
    return this.userService.remove(+id);
  }
}
