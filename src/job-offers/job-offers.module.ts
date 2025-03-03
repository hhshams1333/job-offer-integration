import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JobOffer } from './entities/job-offer.entity';
import { ApiFetchService } from './services/api-fetch.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobOffer]),
        HttpModule, // For Axios HTTP requests
    ],
    providers: [ApiFetchService],
    exports: [TypeOrmModule, ApiFetchService],
})
export class JobOffersModule { }