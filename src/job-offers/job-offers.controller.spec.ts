import { Test, TestingModule } from '@nestjs/testing';
import { JobOffersController } from './job-offers.controller';
import { JobOfferService } from './services/job-offer.service';
import { JobOffer } from './entities/job-offer.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JobOffersController', () => {
    let controller: JobOffersController;
    let service: JobOfferService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobOffersController],
            providers: [
                JobOfferService,
                {
                    provide: getRepositoryToken(JobOffer),
                    useClass: Repository,
                },
            ],
        }).compile();

        controller = module.get<JobOffersController>(JobOffersController);
        service = module.get<JobOfferService>(JobOfferService);
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