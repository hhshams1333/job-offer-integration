import { Test, TestingModule } from '@nestjs/testing';
import { JobOffersController } from './job-offers.controller';
import { JobOfferService } from './services/job-offer.service';
import { JobOffer } from './entities/job-offer.entity';
import { ApiFetchService } from './services/api-fetch.service';
import { TransformService } from './services/transform.service';
import { SchedulerService } from './services/scheduler.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('JobOffersController', () => {
    let app: INestApplication;
    let controller: JobOffersController;
    let service: JobOfferService;
    let jobOfferRepository: Repository<JobOffer>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [JobOffer],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([JobOffer]), // Add this line to import the repository
                ScheduleModule.forRoot(), // For SchedulerService
                HttpModule, // For ApiFetchService
            ],
            controllers: [JobOffersController],
            providers: [
                JobOfferService,
                {
                    provide: getRepositoryToken(JobOffer),
                    useClass: Repository, // Provide the Repository class
                },
                {
                    provide: ApiFetchService,
                    useValue: {
                        fetchProvider1Data: jest.fn(),
                        fetchProvider2Data: jest.fn(),
                    },
                },
                {
                    provide: TransformService,
                    useValue: {
                        transformProvider1: jest.fn(),
                        transformProvider2: jest.fn(),
                    },
                },
                {
                    provide: SchedulerService,
                    useValue: {
                        fetchAndSave: jest.fn(),
                        updateCronSchedule: jest.fn(),
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        controller = module.get<JobOffersController>(JobOffersController);
        service = module.get<JobOfferService>(JobOfferService);
        jobOfferRepository = module.get<Repository<JobOffer>>(getRepositoryToken(JobOffer));
    });

    afterEach(async () => {
        if (app) {
            await app.close(); // Only call close if app is defined
        }
    });

    it('should return paginated job offers', async () => {
        const mockResult = {
            data: [{
                id: '1',
                title: 'Test Job',
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
            }],
            total: 1,
        };
        jest.spyOn(service, 'findJobOffers').mockResolvedValue(mockResult);

        const result = await controller.getJobOffers({ page: 1, limit: 10 });
        expect(result).toEqual(mockResult);
        expect(service.findJobOffers).toHaveBeenCalledWith({}, 1, 10);
    });

    it('should handle filters', async () => {
        const mockResult = { data: [], total: 0 };
        jest.spyOn(service, 'findJobOffers').mockResolvedValue(mockResult);

        await controller.getJobOffers({ title: 'Engineer', page: 1, limit: 5 });
        expect(service.findJobOffers).toHaveBeenCalledWith({ title: 'Engineer' }, 1, 5);
    });
});