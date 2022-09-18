import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET } from '../constants/auth.constants';

export function getUserIdFromRequest(req: Request) : string {
    let idToken = null;
    const authHeader = req?.headers?.authorization || "";
    const token = authHeader.replace('Bearer ', '');
    try {
        verify(token, JWT_ACCESS_TOKEN_SECRET, (err, token) => {
            if(err) {
                console.log(err)
            } else {
                idToken = token
            }
        });
        return idToken.id;
    } catch(e) {
        return "";
    }

}