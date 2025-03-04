// src/job-offers/services/scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { ApiFetchService } from './api-fetch.service';
import { TransformService } from './transform.service';
import { JobOfferService } from './job-offer.service';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private readonly apiFetchService: ApiFetchService,
        private readonly transformService: TransformService,
        private readonly jobOfferService: JobOfferService,
        private readonly configService: ConfigService,
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {
        this.setupCronJob();
    }

    private async fetchAndSave() {
        this.logger.log('Starting scheduled job offer fetch');

        try {
            const provider1Data = await this.apiFetchService.fetchProvider1Data();
            const transformedProvider1 = this.transformService.transformProvider1(provider1Data);
            await this.jobOfferService.saveJobOffers(transformedProvider1);

            const provider2Data = await this.apiFetchService.fetchProvider2Data();
            const transformedProvider2 = this.transformService.transformProvider2(provider2Data);
            await this.jobOfferService.saveJobOffers(transformedProvider2);

            this.logger.log('Scheduled job offer fetch completed successfully');
        } catch (error) {
            this.logger.error('Scheduled job offer fetch failed', error.stack);
        }
    }

    private setupCronJob() {
        const cronSchedule = this.configService.get<string>('CRON_SCHEDULE', '0 * * * *'); // Default: every hour
        const job = new CronJob(cronSchedule, () => this.fetchAndSave());

        this.schedulerRegistry.addCronJob('fetchJobOffers', job);
        job.start();

        this.logger.log(`Cron job scheduled with pattern: ${cronSchedule}`);
    }
}