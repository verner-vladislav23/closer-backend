import { Injectable } from '@nestjs/common';
import SessionConfig from 'src/config/session'
import UserSessionModel, { UserSession} from '../../models/UserSession'
import { ObjectID } from 'mongodb';

@Injectable()
export class SessionService {

    async findSession(token: string): Promise<UserSession> {
        const sessionModel = UserSessionModel;
        const session = sessionModel.findOne({ token: token });

        return session;
    }

    /**
     * Delete session
     * @param id 
     */
    async deleteSession(userSession: UserSession) {
        const sessionModel = UserSessionModel;
        await sessionModel.deleteOne(userSession);
    }

    /**
     * Create Session
     * @param user 
     * @param token 
     */
    async createSession(user_id: ObjectID, token: string) {
        const expires_at = new Date(new Date().getTime() + (1000 * 60 * 60 * 24) * SessionConfig.expirationDate);

        const sessionModel = UserSessionModel;
        const session = new UserSession();

        session.user_id = user_id;
        session.token = token;
        session.expires_at = expires_at;

        sessionModel.create(session);
    }

    /**
     * Has session date not expired
     * @param session 
     */
    async validateSession(session: UserSession): Promise<boolean> {
        const sessionExpiresAt = session.expires_at;
        const today = new Date();

        if (sessionExpiresAt < today) {
            return false;
        }
        return true;
    }
}
