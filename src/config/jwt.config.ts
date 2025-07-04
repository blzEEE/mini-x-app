import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export async function JwtConfig(configService: ConfigService): Promise<JwtModuleOptions> {
    return {
        secret: await configService.getOrThrow("JWT_SECRET_KEY"),
        signOptions: {
            algorithm: 'HS256'
        },
        verifyOptions: {
            algorithms: ['HS256'],
            ignoreExpiration: false
        }
    }
}