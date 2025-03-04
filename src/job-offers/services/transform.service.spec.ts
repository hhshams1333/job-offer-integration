import { Test, TestingModule } from '@nestjs/testing';
import { TransformService } from './transform.service';
import { Provider1Response } from '../interfaces/provider1-response.interface';
import { Provider2Response } from '../interfaces/provider2-response.interface';
import { JobOffer } from '../entities/job-offer.entity';

describe('TransformService', () => {
    let service: TransformService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TransformService],
        }).compile();

        service = module.get<TransformService>(TransformService);
    });

    it('should transform Provider 1 data correctly', () => {
        const mockProvider1Data: Provider1Response = {
            metadata: { requestId: 'req-123', timestamp: '2025-03-03T12:00:00Z' },
            jobs: [{
                jobId: 'P1-744',
                title: 'Backend Engineer',
                details: { location: 'New York, NY', type: 'Full-Time', salaryRange: '$88k - $135k' },
                company: { name: 'Creative Design Ltd', industry: 'Solutions' },
                skills: ['Python', 'SQL'],
                postedDate: '2025-02-25T14:46:07.045Z',
            }],
        };

        const result = service.transformProvider1(mockProvider1Data);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            id: 'P1-744',
            title: 'Backend Engineer',
            location: 'New York, NY',
            type: 'Full-Time',
            minSalary: 88000,
            maxSalary: 135000,
            companyName: 'Creative Design Ltd',
            skills: ['Python', 'SQL'],
        });
    });

    it('should transform Provider 2 data correctly', () => {
        const mockProvider2Data: Provider2Response = {
            status: 'success',
            data: {
                jobsList: {
                    'job-926': {
                        position: 'Software Engineer',
                        location: { city: 'San Francisco', state: 'CA', remote: false },
                        compensation: { min: 68000, max: 92000, currency: 'USD' },
                        employer: { companyName: 'TechCorp', website: 'https://techcorp.com' },
                        requirements: { experience: 1, technologies: ['JavaScript', 'Node.js'] },
                        datePosted: '2025-02-27',
                    },
                },
            },
        };

        const result = service.transformProvider2(mockProvider2Data);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            id: 'job-926',
            title: 'Software Engineer',
            location: 'San Francisco, CA',
            remote: false,
            minSalary: 68000,
            maxSalary: 92000,
            companyName: 'TechCorp',
            skills: ['JavaScript', 'Node.js'],
        });
    });

    it('should deduplicate job offers', () => {
        const jobOffers: JobOffer[] = [
            {
                id: '1',
                title: 'Job 1',
                location: 'NY',
                type: null,
                remote: false,
                minSalary: null,
                maxSalary: null,
                currency: null,
                companyName: 'Test',
                industry: null,
                website: null,
                skills: [],
                experience: null,
                postedDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: '1',
                title: 'Job 1 Duplicate',
                location: 'NY',
                type: null,
                remote: false,
                minSalary: null,
                maxSalary: null,
                currency: null,
                companyName: 'Test',
                industry: null,
                website: null,
                skills: [],
                experience: null,
                postedDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        const result = service.mergeAndDeduplicate(jobOffers);
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Job 1');
    });
});