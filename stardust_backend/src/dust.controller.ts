import { Controller, Get } from '@nestjs/common';
import {StellarService} from "./stellar.service";

@Controller("/dust")
export class DustController {
    constructor(private readonly stellarService: StellarService) {}

    @Get()
    async getServerAccount(): Promise<string> {
        return await this.stellarService.getKeyPair().then((res)=>res.publicKey())
    }
}
