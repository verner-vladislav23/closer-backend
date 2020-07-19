import { Injectable } from '@nestjs/common';
import { UserSession, getUserSessionModel } from '../../models/UserSession'
import { User } from 'src/models/User';

@Injectable()
export class SessionService {

    async findSession(token: string): Promise<UserSession> {
        const sessionModel = getUserSessionModel();
        const session = sessionModel.findOne({token: token});

        return session;
    }

    /**
     * Delete session
     * @param id 
     */
    async deleteSession(userSession: UserSession) {
        const sessionModel = getUserSessionModel();
        await sessionModel.deleteOne(userSession);
    }

    /**
     * Create Session
     * @param user 
     * @param token 
     */
    async createSession(user: User, token: string) {
        const sessionModel = getUserSessionModel();
        const session = new UserSession(user, token);
        sessionModel.create(session);
    }


    /*async refreshSession(id: number) {

    }*/
}
