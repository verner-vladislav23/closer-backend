import { Controller, Post, Get, Put, Request, UseInterceptors, UploadedFile, UsePipes, Body } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { AuthService } from 'src/services/auth/auth.service';
import * as Schemes from 'src/schemes/user.schemes';
import { BufferedFile } from 'src/models/File';
import { FileInterceptor } from '@nestjs/platform-express'
import responseStatus from '../responseStatus';
import { FileUploadService } from 'src/services/minio/file-upload/file-upload.service';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';

const _ = require('lodash');

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private fileUploadService: FileUploadService
    ) { }

    /**
     * Get user profile information 
     * @param request 
     */
    @Get('profile')
    async getDetail(@Request() request) {
        const data = request.query;

        if (_.has(data, 'username') === false) {
            return { status: responseStatus.ERROR, message: 'please provide username' }
        }

        const username = data['username'].toString();
        const user = await this.userService.findUser(username);

        if (user === null) {
            return { status: responseStatus.OK, message: `no user '${data.username}' was found` }
        }

        const customUser = this.userService.castUser(user);
        return { status: responseStatus.OK, data: customUser };
    }

    @Put('avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateAvatar(@UploadedFile() image: BufferedFile) {
        const user = (await this.authService.user);
        const previousImageUrl = user.avatarUrl;

        try {
            if (previousImageUrl) {
                if (previousImageUrl.length > 0) {
                    this.fileUploadService.deleteImage(previousImageUrl);
                    user.avatarUrl = "";
                }
            }
            const imageUrl = await this.fileUploadService.uploadImage(image);

            await this.userService.updateAvatarUrl(user._id, imageUrl);
            return { status: responseStatus.OK };
        } catch (exception) {
            return { status: responseStatus.ERROR, message: exception.details[0].message };
        }
    }

    @Put('profile')
    async updateProfile(@Request() req, @Body(new JoiValidationPipe(Schemes.updateProfile)) body) {

        const data = req.body;

        const userId = this.authService.authorizedUserID;

        const { firstName, lastName, description, email } = data;

        await this.userService.updateProfile(userId, firstName, lastName, description, email);

        return { status: responseStatus.OK };
    }

    /**
     * Fetch near users list
     * @param request
     */
    @Get('near-users')
    async findNear() {
        const user = (await this.authService.user);

        const usersFound = await this.userService.findNear(user);
        const customUsers = usersFound.map(this.userService.castUser);

        return { status: responseStatus.OK, data: customUsers };
    }

    @Put('location')
    async updateLocation(@Request() request, @Body(new JoiValidationPipe(Schemes.updateLocation)) body) {
        const data = request.body;

        const userId = await this.authService.authorizedUserID;

        await this.userService.updateLocation(userId, data.location);
        return { status: responseStatus.OK };
    }

    @Put('password')
    async changePassword(@Request() request, @Body(new JoiValidationPipe(Schemes.changePassword)) body) {
        const data = request.body;

        const { oldPassword, newPassword } = data;

        const user = (await this.authService.user);
        const validatedUser = this.authService.validateUser(user.username, oldPassword);

        if (validatedUser) {
            const passwordHash = this.authService.getHash(newPassword, user.salt);
            await this.userService.changePassword(user._id, passwordHash);
            return { status: responseStatus.OK }
        } else {
            return { status: responseStatus.ERROR, message: "passwords do not match" };
        }
    }

}
