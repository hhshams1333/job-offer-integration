import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JobOffer } from './entities/job-offer.entity';
import { ApiFetchService } from './services/api-fetch.service';
import { TransformService } from './services/transform.service';
import { JobOffersController } from './job-offers.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobOffer]),
        HttpModule,
    ],
    controllers: [JobOffersController],
    providers: [ApiFetchService, TransformService],
    exports: [TypeOrmModule, ApiFetchService, TransformService],
})
export class JobOffersModule { }