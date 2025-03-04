// src/job-offers/job-offers.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiFetchService } from './services/api-fetch.service';
import { TransformService } from './services/transform.service';
import { JobOffer } from './entities/job-offer.entity';

@Controller('test')
export class JobOffersController {
    constructor(
        private readonly apiFetchService: ApiFetchService,
        private readonly transformService: TransformService,
    ) { }

    @Get('provider1')
    async testProvider1(): Promise<JobOffer[]> {
        const data = await this.apiFetchService.fetchProvider1Data();
        return this.transformService.transformProvider1(data);
    }

    @Get('provider2')
    async testProvider2(): Promise<JobOffer[]> {
        const data = await this.apiFetchService.fetchProvider2Data();
        return this.transformService.transformProvider2(data);
    }
}