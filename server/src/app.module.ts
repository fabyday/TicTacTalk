import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [ChatModule, AuthModule],
  controllers: [AppController, ChatController],
  providers: [AppService],
})
export class AppModule {}
