import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JobOffer } from './entities/job-offer.entity';
import { ApiFetchService } from './services/api-fetch.service';
import { TransformService } from './services/transform.service';
import { JobOffersController } from './job-offers.controller';
import { JobOfferService } from './services/job-offer.service';
import { SchedulerService } from './services/scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobOffer]),
        HttpModule,
        ScheduleModule.forRoot(),
    ],
    providers: [ApiFetchService, TransformService, JobOfferService, SchedulerService],
    exports: [TypeOrmModule, ApiFetchService, TransformService, JobOfferService],
    controllers: [JobOffersController],

})
export class JobOffersModule { }