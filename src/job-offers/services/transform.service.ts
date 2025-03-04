import { Injectable, Logger } from '@nestjs/common';
import { JobOffer } from '../entities/job-offer.entity';
import { Provider1Response, Provider1Job } from '../interfaces/provider1-response.interface';
import { Provider2Response, Provider2Job } from '../interfaces/provider2-response.interface';

@Injectable()
export class TransformService {
    private readonly logger = new Logger(TransformService.name);

    // Transform Provider 1 data
    transformProvider1(data: Provider1Response): JobOffer[] {
        this.logger.log('Transforming Provider 1 data');
        return data.jobs.map((job: Provider1Job) => this.mapProvider1Job(job));
    }

    // Transform Provider 2 data
    transformProvider2(data: Provider2Response): JobOffer[] {
        this.logger.log('Transforming Provider 2 data');
        const jobsList = data.data.jobsList;
        return Object.keys(jobsList).map((jobId: string) =>
            this.mapProvider2Job(jobId, jobsList[jobId]),
        );
    }

    private mapProvider1Job(job: Provider1Job): JobOffer {
        const { minSalary, maxSalary } = this.parseSalaryRange(job.details.salaryRange);

        return {
            id: job.jobId,
            title: job.title,
            location: job.details.location,
            type: job.details.type,
            remote: false, // Provider 1 doesn’t specify remote, default to false
            minSalary,
            maxSalary,
            currency: 'USD', // Assumed from format, could be configurable
            companyName: job.company.name,
            industry: job.company.industry,
            website: null, // Not provided by Provider 1
            skills: job.skills,
            experience: null, // Not provided by Provider 1
            postedDate: new Date(job.postedDate),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    private mapProvider2Job(jobId: string, job: Provider2Job): JobOffer {
        return {
            id: jobId,
            title: job.position,
            location: `${job.location.city}, ${job.location.state}`,
            type: null, // Not provided by Provider 2
            remote: job.location.remote,
            minSalary: job.compensation.min,
            maxSalary: job.compensation.max,
            currency: job.compensation.currency,
            companyName: job.employer.companyName,
            industry: null, // Not provided by Provider 2
            website: job.employer.website,
            skills: job.requirements.technologies,
            experience: job.requirements.experience,
            postedDate: new Date(job.datePosted),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    // Helper to parse salary range (e.g., "$88k - $135k")
    private parseSalaryRange(salaryRange: string): { minSalary: number | null; maxSalary: number | null } {
        if (!salaryRange) return { minSalary: null, maxSalary: null };

        const [min, max] = salaryRange
            .replace(/[^0-9k-]/g, '') // Remove non-numeric except 'k' and '-'
            .split('-')
            .map((value) => {
                const num = parseFloat(value.replace('k', '')) * 1000;
                return isNaN(num) ? null : num;
            });

        return { minSalary: min || null, maxSalary: max || null };
    }

    // Merge and deduplicate job offers
    mergeAndDeduplicate(jobOffers: JobOffer[]): JobOffer[] {
        const uniqueJobs = new Map<string, JobOffer>();
        jobOffers.forEach((job) => {
            if (!uniqueJobs.has(job.id)) {
                uniqueJobs.set(job.id, job);
            } else {
                this.logger.warn(`Duplicate job ID found: ${job.id}`);
            }
        });
        return Array.from(uniqueJobs.values());
    }
}