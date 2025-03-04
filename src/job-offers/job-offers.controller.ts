import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiFetchService } from './services/api-fetch.service';
import { TransformService } from './services/transform.service';
import { JobOfferService } from './services/job-offer.service';
import { JobOffer } from './entities/job-offer.entity';
import { GetJobOffersDto } from './dto/get-job-offers.dto';

@Controller('api')
export class JobOffersController {
    constructor(
        private readonly apiFetchService: ApiFetchService,
        private readonly transformService: TransformService,
        private readonly jobOfferService: JobOfferService,
    ) { }

    @Get('job-offers')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getJobOffers(
        @Query() query: GetJobOffersDto,
    ): Promise<{ data: JobOffer[]; total: number }> {
        const { title, location, minSalary, maxSalary, page, limit } = query;
        return this.jobOfferService.findJobOffers(
            { title, location, minSalary, maxSalary },
            page,
            limit,
        );
    }

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