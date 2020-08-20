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
        const previousImage_url = user.avatarUrl;

        try {
            if (previousImage_url != null) {
                if (previousImage_url.length > 0) {
                    this.fileUploadService.deleteImage(previousImage_url);
                    user.avatarUrl = "";
                }
            }
            const image_url = await this.fileUploadService.uploadImage(image);
            const userId = user._id;

            await this.userService.updateAvatarUrl(userId, image_url);
            return { status: responseStatus.OK };
        } catch (exception) {
            return { status: responseStatus.ERROR, message: exception.details[0].message };
        }
    }

    @Put('profile')
    async updateProfile(@Request() req, @Body(new JoiValidationPipe(Schemes.updateProfile)) body) {

        const data = req.body;

        // try {
        //     await Schemes.updateProfile.validateAsync(data);
        // } catch (exception) {
        //     return { status: responseStatus.ERROR, message: exception.details[0].message };
        // }

        const user = (await this.authService.user);

        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.description = data.description;
        user.email = data.email;

        await this.userService.updateProfile(user._id, user);

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
    async updateLocation(@Request() request) {
        const data = request.body;

        try {
            await Schemes.updateLocation.validateAsync(data);
        } catch (exception) {
            return { status: responseStatus.ERROR, message: exception.details[0].message };
        }

        const user = (await this.authService.user);

        await this.userService.updateLocation(user._id, data.location);
        return { status: responseStatus.OK };
    }

    @Put('password')
    async changePassword(@Request() request) {
        const data = request.body;

        try {
            await Schemes.changePassword.validateAsync(data);
        } catch (exception) {
            return { status: responseStatus.ERROR, message: exception.details[0].message }
        }

        const { oldPassword, newPassword } = data;

        const user = (await this.authService.user);
        const validatedUser = this.authService.validateUser(user.username, oldPassword);

        if (validatedUser) {
            const passwordHash = await this.authService.getHash(newPassword, user.salt);
            await this.userService.changePassword(user._id, passwordHash);
            return { status: responseStatus.OK }
        } else {
            return { status: responseStatus.ERROR, message: "passwords do not match" };
        }
    }

}
