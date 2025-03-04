import { Controller, Get } from '@nestjs/common';
import { ApiFetchService } from './services/api-fetch.service';
import { TransformService } from './services/transform.service';
import { JobOfferService } from './services/job-offer.service';
import { JobOffer } from './entities/job-offer.entity';

@Controller('test')
export class JobOffersController {
    constructor(
        private readonly apiFetchService: ApiFetchService,
        private readonly transformService: TransformService,
        private readonly jobOfferService: JobOfferService,
    ) { }

    @Get('provider1')
    async testProvider1(): Promise<JobOffer[]> {
        const data = await this.apiFetchService.fetchProvider1Data();
        const transformed = this.transformService.transformProvider1(data);
        await this.jobOfferService.saveJobOffers(transformed);
        return transformed;
    }

    @Get('provider2')
    async testProvider2(): Promise<JobOffer[]> {
        const data = await this.apiFetchService.fetchProvider2Data();
        const transformed = this.transformService.transformProvider2(data);
        await this.jobOfferService.saveJobOffers(transformed);
        return transformed;
    }

    @Get('all')
    async getAll(): Promise<JobOffer[]> {
        return this.jobOfferService.findAll();
    }
}