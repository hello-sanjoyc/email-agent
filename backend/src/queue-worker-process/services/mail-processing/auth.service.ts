import axios from 'axios';
import env from '../../../config/env';
export class AuthService{
    async refreshGoogleToken(refreshToken:string):Promise<string>{
        const response = await axios.post<{access_token:string}>('https://oauth2.googleapis.com/token',{
            client_id:env.GOOGLE_CLIENT_ID,
            client_secret:env.GOOGLE_CLIENT_SECRET,
            refresh_token:refreshToken,
            grant_type:'refresh_token',
        });
        return response.data.access_token
    }
    async refreshMicrosoftToken(refreshToken:string):Promise<string>{
        const params = new URLSearchParams();
        params.append('client_id', env.MICROSOFT_CLIENT_ID);
        params.append('client_secret', env.MICROSOFT_CLIENT_SECRET);
        params.append('refresh_token', refreshToken);
        params.append('grant_type', 'refresh_token');
        const response = await axios.post<{access_token:string}>('https://login.microsoftonline.com/common/oauth2/v2.0/token',
            params,
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token
    }
    buildXOAUTH2String(accessToken:string,user:string):string{
        const authString = `user=${user}\x01auth=Bearer ${accessToken}\x01\x01`;
        return Buffer.from(authString).toString('base64');
    }
}