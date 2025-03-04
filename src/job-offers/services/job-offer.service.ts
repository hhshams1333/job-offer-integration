import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
        try {
            // Batch upsert for efficiency
            await this.jobOfferRepository.upsert(jobOffers, ['id']);
            this.logger.log('Job offers saved successfully');
        } catch (error) {
            this.logger.error('Failed to save job offers', error.stack);
            throw new InternalServerErrorException('Failed to save job offers to the database');
        }
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

        if (filters.title) {
            query.andWhere('job.title ILIKE :title', { title: `%${filters.title}%` });
        }
        if (filters.location) {
            query.andWhere('job.location ILIKE :location', { location: `%${filters.location}%` });
        }
        if (filters.minSalary !== undefined) {
            if (isNaN(filters.minSalary)) throw new BadRequestException('minSalary must be a number');
            query.andWhere('job.minSalary >= :minSalary', { minSalary: filters.minSalary });
        }
        if (filters.maxSalary !== undefined) {
            if (isNaN(filters.maxSalary)) throw new BadRequestException('maxSalary must be a number');
            query.andWhere('job.maxSalary <= :maxSalary', { maxSalary: filters.maxSalary });
        }

        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        try {
            const [data, total] = await query.getManyAndCount();
            return { data, total };
        } catch (error) {
            this.logger.error('Failed to fetch job offers', error.stack);
            throw new InternalServerErrorException('Failed to retrieve job offers');
        }
    }
    async findAll(): Promise<JobOffer[]> {
        return this.jobOfferRepository.find();
    }
}

