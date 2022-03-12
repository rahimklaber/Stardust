import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DustController} from "./dust.controller";
import {StellarService} from "./stellar.service";

@Module({
  imports: [],
  controllers: [AppController,DustController],
  providers: [AppService,StellarService],
})
export class AppModule {}
