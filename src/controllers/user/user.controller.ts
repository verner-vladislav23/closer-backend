import { Controller, Post, Req, Get, Put, Delete } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/services/user/user.service';
import { SessionService } from 'src/services/session/session.service';
import { AuthService } from 'src/services/auth/auth.service';
import * as Schemes from 'src/schemes/user.schemes';
import ResponseStatus from '../responseStatus'
import responseStatus from '../responseStatus';

const _ = require('lodash');

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private sessionService: SessionService,
        private authService: AuthService
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
     * Get user profile information 
     * @param request 
     */
    @Get('profile')
    async getDetail(@Req() request: Request) {
        const data = request.query;

        if (_.has(data, 'username') === false) {
            return { status: responseStatus.ERROR, message: 'please provide username' }
        }

        const username = data['username'].toString();
        const user = await this.userService.findUser(username);

        if (user === null) {
            return { status: responseStatus.OK, message: `no user '${data.username}' was found` }
        }

        return { status: responseStatus.OK, data: user };
    }

    /**
     * Fetch near users list
     * @param request
     */
    @Get('near-users')
    async findNear() {
        const user = this.authService.user;

        const usersFound = await this.userService.findNear(user);
        
        return { status: responseStatus.OK, data: usersFound };
    }

    @Post('update-location')
    async updateLocation(@Req() request: Request) {
        const data = request.body;

        try {
            await Schemes.updateLocation.validateAsync(data);
        } catch (exception) {
            return { status: ResponseStatus.ERROR, message: exception.details[0].message };
        }

        const { latitude, longitude } = data.location;
        let user = this.authService.user;

        user.location.coordinates = [latitude, longitude];

        this.userService.update(user);
        return { status: responseStatus.OK };
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
