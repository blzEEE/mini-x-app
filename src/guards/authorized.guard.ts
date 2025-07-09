import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class AuthorizedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const {user, refreshToken} = request.cookies
        console.log(request.cookies)
        if(user && refreshToken){
            return true
        }
        return false
    }
}