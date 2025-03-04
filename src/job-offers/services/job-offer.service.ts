// src/job-offers/services/job-offer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from '../entities/job-offer.entity';

@Injectable()
export class JobOfferService {
    private readonly logger = new Logger(JobOfferService.name);

    constructor(
        @InjectRepository(JobOffer)
        private readonly jobOfferRepository: Repository<JobOffer>,
    ) { }

    async saveJobOffers(jobOffers: JobOffer[]): Promise<void> {
        this.logger.log(`Saving ${jobOffers.length} job offers to the database`);

        for (const job of jobOffers) {
            try {
                // Upsert: insert if not exists, update if exists
                await this.jobOfferRepository.upsert(job, ['id']);
            } catch (error) {
                this.logger.error(`Failed to save job offer ${job.id}`, error.stack);
                throw error;
            }
        }
        this.logger.log('Job offers saved successfully');
    }

    // Optional: Fetch all job offers for testing
    async findAll(): Promise<JobOffer[]> {
        return this.jobOfferRepository.find();
    }
}