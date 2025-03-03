import { Controller, Get } from '@nestjs/common';
import { ApiFetchService } from './services/api-fetch.service';
import { Provider1Response } from './interfaces/provider1-response.interface';
import { Provider2Response } from './interfaces/provider2-response.interface';

@Controller('test')
export class JobOffersController {
    constructor(private readonly apiFetchService: ApiFetchService) { }

    @Get('provider1')
    async testProvider1(): Promise<Provider1Response> {
        return this.apiFetchService.fetchProvider1Data();
    }

    @Get('provider2')
    async testProvider2(): Promise<Provider2Response> {
        return this.apiFetchService.fetchProvider2Data();
    }
}