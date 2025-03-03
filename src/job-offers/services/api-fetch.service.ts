// src/job-offers/services/api-fetch.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Provider1Response } from '../interfaces/provider1-response.interface';
import { Provider2Response } from '../interfaces/provider2-response.interface';

@Injectable()
export class ApiFetchService {
    private readonly logger = new Logger(ApiFetchService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async fetchProvider1Data(): Promise<Provider1Response> {
        const url = this.configService.get<string>('PROVIDER_1_URL');
        if (!url) {
            throw new BadRequestException('PROVIDER_1_URL is not defined in environment variables');
        }
        try {
            const response = await firstValueFrom(this.httpService.get<Provider1Response>(url));
            this.logger.log('Successfully fetched data from Provider 1');
            return response.data;
        } catch (error) {
            this.logger.error('Failed to fetch data from Provider 1', error.stack);
            throw error;
        }
    }

    async fetchProvider2Data(): Promise<Provider2Response> {
        const url = this.configService.get<string>('PROVIDER_2_URL');
        if (!url) {
            throw new BadRequestException('PROVIDER_2_URL is not defined in environment variables');
        }
        try {
            const response = await firstValueFrom(this.httpService.get<Provider2Response>(url));
            this.logger.log('Successfully fetched data from Provider 2');
            return response.data;
        } catch (error) {
            this.logger.error('Failed to fetch data from Provider 2', error.stack);
            throw error;
        }
    }
}