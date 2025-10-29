import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QueryModule } from './query/query.module';

@Module({
  imports: [AuthModule, QueryModule],
})
export class AppModule {}
