import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TagModule } from 'src/tag/tag.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TagModule,
    RedisModule
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
