import { Controller, Post, Req, Get, Put, Delete } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/models/User';

const _ = require('lodash');

@Controller('user')
export class UserController {

    /**
     * Создать пользователя.
     * @param request 
     */
    @Post('test/create')
    async testCreate(@Req() request: Request)
    {
        const UserModel = new User().getModelForClass(User);
        const data = request.body;

        if(_.has(data, 'username') === false) {
            return {status: 'error', message: 'Please provide username'}
        }

        let user = await UserModel.findOne({username: data.username});

        if(user === null) {
            user = await UserModel.create(data)
        } else {
            user.update(data);
        }
        user.save();

        return {status: 'ok', data: user};
    }

    /**
     *  Детальная информация о пользователе по его нику.
     * @param request 
     */
    @Get('test/detail')
    async testDetail(@Req() request: Request)
    {
        const UserModel = new User().getModelForClass(User);
        const data = request.body;

        if(_.has(data, 'username') === false) {
            return {status: 'error', message: 'please provide username'}
        }

        let user = await UserModel.findOne({username: data.username});

        if(user === null) {
            return {status: 'ok', message: `no user '${data.username}' was found`}
        }

        return {status: 'ok', data: user};
    }

    /**
     * Найти список юзеров в радиусе 50м от этого юзера.
     * @param request
     */
    @Get('test/find-near')
    async testFindNear(@Req() request: Request)
    {
        const UserModel = new User().getModelForClass(User);
        const data = request.body;

        if(_.has(data, 'username') === false) {
            return {status: 'error', message: 'please provide username'}
        }

        let user = await UserModel.findOne({username: data.username});

        if(user === null) {
            return {status: 'ok', message: `no user '${data.username}' was found`}
        }

        const usersFound = await UserModel.find( {
            username: {$ne: user.username},
            location:
              { $near :
                 {
                   $geometry: user.location,
                   $minDistance: 0,
                   $maxDistance: 50
                 }
              }
          });

        return {status: 'ok', data: usersFound};
    }
    /**
     * Logout
     * @param request
     */
    @Put('test/logout')
    async logout()
    {

    }
    /**
     * Удаление учетной записи
     */
    @Delete('test/delete')
    async deleteAccount()
    {

    }
}
