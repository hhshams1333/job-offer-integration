// src/job-offers/dto/get-job-offers.dto.ts
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetJobOffersDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minSalary?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxSalary?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number = 10;
}