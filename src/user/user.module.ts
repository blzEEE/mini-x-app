import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [CacheModule.register({

  }),
  RedisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
