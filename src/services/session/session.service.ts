import { Injectable, Logger } from '@nestjs/common';
import SessionConfig from 'src/config/session'
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
        const expires_at = new Date(new Date().getTime() + (1000*60*60*24)*SessionConfig.expirationDate);

        const sessionModel = getUserSessionModel();
        const session = new UserSession(user, token, expires_at);
        
        sessionModel.create(session);
    }

    /*async refreshSession(id: number) {

    }*/
}
