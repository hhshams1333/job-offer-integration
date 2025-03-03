import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from './entities/job-offer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([JobOffer])],
    exports: [TypeOrmModule],
})
export class JobOffersModule { }