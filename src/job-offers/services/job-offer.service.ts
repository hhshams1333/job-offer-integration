// src/job-offers/services/job-offer.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
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
                await this.jobOfferRepository.upsert(job, ['id']);
            } catch (error) {
                this.logger.error(`Failed to save job offer ${job.id}`, error.stack);
                throw error;
            }
        }
        this.logger.log('Job offers saved successfully');
    }

    async findJobOffers(
        filters: {
            title?: string;
            location?: string;
            minSalary?: number;
            maxSalary?: number;
        },
        page: number = 1,
        limit: number = 10,
    ): Promise<{ data: JobOffer[]; total: number }> {
        const query = this.jobOfferRepository.createQueryBuilder('job');

        // Apply filters
        if (filters.title) {
            query.andWhere('job.title ILIKE :title', { title: `%${filters.title}%` });
        }
        if (filters.location) {
            query.andWhere('job.location ILIKE :location', { location: `%${filters.location}%` });
        }
        if (filters.minSalary !== undefined) {
            query.andWhere('job.minSalary >= :minSalary', { minSalary: filters.minSalary });
        }
        if (filters.maxSalary !== undefined) {
            query.andWhere('job.maxSalary <= :maxSalary', { maxSalary: filters.maxSalary });
        }

        // Pagination
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        try {
            const [data, total] = await query.getManyAndCount();
            return { data, total };
        } catch (error) {
            this.logger.error('Failed to fetch job offers', error.stack);
            throw new BadRequestException('Invalid query parameters');
        }
    }
    async findAll(): Promise<JobOffer[]> {
        return this.jobOfferRepository.find();
    }
}