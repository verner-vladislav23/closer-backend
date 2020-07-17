import { Controller, Post, Req, Get, Put, Delete } from '@nestjs/common';
import { Request } from 'express';
import { User, getUserModel } from 'src/models/User';
import { UserService } from 'src/services/user/user.service';
import { SessionService } from 'src/services/session/session.service';

const _ = require('lodash');

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private sessionService: SessionService
    ) { }

    /**
     * Delete user
     * @param req 
     */
    @Delete('delete')
    async deleteUser(@Req() req: Request) {
        const data = req.body;
        const id = data.id;

        try {
            //this.userService.deleteById(id);
            const userSession = await this.sessionService.findSession(id);
            //this.userService.deleteById(userSession.user.) 
            this.sessionService.deleteSession(userSession);
        } catch {
            //todo
        }

    }

    /**
     * Create user
     * @param request 
     */
    @Post('test/create')
    async testCreate(@Req() request: Request) {
        const UserModel = new User().getModelForClass(User);
        const data = request.body;

        if (_.has(data, 'username') === false) {
            return { status: 'error', message: 'Please provide username' }
        }

        let user = await UserModel.findOne({ username: data.username });

        if (user === null) {
            user = await UserModel.create(data)
        } else {
            user.update(data);
        }
        user.save();

        return { status: 'ok', data: user };
    }

    /**
     *  Детальная информация о пользователе по его нику.
     * @param request 
     */
    @Get('test/detail')
    async testDetail(@Req() request: Request) {
        const UserModel = new User().getModelForClass(User);
        const data = request.body;

        if (_.has(data, 'username') === false) {
            return { status: 'error', message: 'please provide username' }
        }

        let user = await UserModel.findOne({ username: data.username });

        if (user === null) {
            return { status: 'ok', message: `no user '${data.username}' was found` }
        }

        return { status: 'ok', data: user };
    }

    /**
     * Найти список юзеров в радиусе 50м от этого юзера.
     * @param request
     */
    @Get('test/find-near')
    async testFindNear(@Req() request: Request) {
        const UserModel = new User().getModelForClass(User);
        const data = request.body;

        if (_.has(data, 'username') === false) {
            return { status: 'error', message: 'please provide username' }
        }

        let user = await UserModel.findOne({ username: data.username });

        if (user === null) {
            return { status: 'ok', message: `no user '${data.username}' was found` }
        }

        const usersFound = await UserModel.find({
            username: { $ne: user.username },
            location:
            {
                $near:
                {
                    $geometry: user.location,
                    $minDistance: 0,
                    $maxDistance: 50
                }
            }
        });

        return { status: 'ok', data: usersFound };
    }
    /**
     * Logout
     * @param request
     */
    @Put('logout')
    async logout(@Req() req: Request) {
        //todo get token
        const token = 'da';
        try {
            const session = await this.sessionService.findSession(token);

            if (session) {
                this.sessionService.deleteSession(session);
            } else {
                //todo
            }
        } catch {
            //todo
        }

    }
}
