import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { ApiFetchService } from './api-fetch.service';
import { TransformService } from './transform.service';
import { JobOfferService } from './job-offer.service';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

describe('SchedulerService', () => {
    let service: SchedulerService;
    let apiFetchService: jest.Mocked<ApiFetchService>;
    let transformService: jest.Mocked<TransformService>;
    let jobOfferService: jest.Mocked<JobOfferService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SchedulerService,
                { provide: ApiFetchService, useValue: { fetchProvider1Data: jest.fn(), fetchProvider2Data: jest.fn() } },
                { provide: TransformService, useValue: { transformProvider1: jest.fn(), transformProvider2: jest.fn() } },
                { provide: JobOfferService, useValue: { saveJobOffers: jest.fn() } },
                { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('0 * * * *') } },
                SchedulerRegistry,
            ],
        }).compile();

        service = module.get<SchedulerService>(SchedulerService);
        apiFetchService = module.get(ApiFetchService) as any;
        transformService = module.get(TransformService) as any;
        jobOfferService = module.get(JobOfferService) as any;
    });

    it('should schedule and execute fetchAndSave', async () => {
        apiFetchService.fetchProvider1Data.mockResolvedValue({
            metadata: { requestId: 'req-123', timestamp: '2025-03-03T12:00:00Z' },
            jobs: [],
        });
        apiFetchService.fetchProvider2Data.mockResolvedValue({
            status: 'success',
            data: { jobsList: {} },
        });
        transformService.transformProvider1.mockReturnValue([]);
        transformService.transformProvider2.mockReturnValue([]);
        jobOfferService.saveJobOffers.mockResolvedValue(undefined);

        await (service as any).fetchAndSave();
        expect(apiFetchService.fetchProvider1Data).toHaveBeenCalled();
        expect(transformService.transformProvider1).toHaveBeenCalled();
        expect(jobOfferService.saveJobOffers).toHaveBeenCalled();
    });
});