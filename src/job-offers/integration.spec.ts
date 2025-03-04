import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { JobOffersModule } from './job-offers.module';
import { JobOffer } from './entities/job-offer.entity';
import { ApiFetchService } from './services/api-fetch.service';
import { of } from 'rxjs';
import { SchedulerService } from './services/scheduler.service';

describe('JobOffers Integration', () => {
    let app: INestApplication;
    let httpService: HttpService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [JobOffer],
                    synchronize: true,
                }),
                HttpModule,
                ScheduleModule.forRoot(),
                JobOffersModule,
            ],
        })
            .overrideProvider(ApiFetchService)
            .useValue({
                fetchProvider1Data: jest.fn().mockResolvedValue({
                    metadata: { requestId: 'req-123', timestamp: '2025-03-03T12:00:00Z' },
                    jobs: [{
                        jobId: 'P1-744',
                        title: 'Backend Engineer',
                        details: { location: 'New York, NY', type: 'Full-Time', salaryRange: '$88k - $135k' },
                        company: { name: 'Creative Design Ltd', industry: 'Solutions' },
                        skills: ['Python', 'SQL'],
                        postedDate: '2025-02-25T14:46:07.045Z',
                    }],
                }),
                fetchProvider2Data: jest.fn().mockResolvedValue({
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
                }),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        httpService = moduleFixture.get(HttpService);
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should fetch, transform, and store data, then retrieve via API', async () => {
        // Mock HTTP responses (already mocked via ApiFetchService override)
        const schedulerService = app.get<SchedulerService>(SchedulerService);
        await (schedulerService as any).fetchAndSave();

        // Test API endpoint
        const response = await app.getHttpServer()
            .get('/api/job-offers')
            .expect(200);

        const { data, total } = response.body;
        expect(total).toBe(2);
        expect(data).toContainEqual(
            expect.objectContaining({ id: 'P1-744', title: 'Backend Engineer' }),
        );
        expect(data).toContainEqual(
            expect.objectContaining({ id: 'job-926', title: 'Software Engineer' }),
        );
    });
});