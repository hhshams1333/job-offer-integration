import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Provider1Response } from '../interfaces/provider1-response.interface';
import { Provider2Response } from '../interfaces/provider2-response.interface';
import axiosRetry from 'axios-retry';

@Injectable()
export class ApiFetchService {
    private readonly logger = new Logger(ApiFetchService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        // Configure axios retries
        axiosRetry(this.httpService.axiosRef, {
            retries: 3,
            retryDelay: (retryCount) => retryCount * 1000, // 1s, 2s, 3s
            retryCondition: (error) => error.response?.status && error.response?.status >= 500 || !error.response,
        });
    }

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
            this.logger.error(`Failed to fetch data from Provider 1 after retries`, error.stack);
            throw new BadRequestException('Failed to fetch data from Provider 1');
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
            this.logger.error(`Failed to fetch data from Provider 2 after retries`, error.stack);
            throw new BadRequestException('Failed to fetch data from Provider 2');
        }
    }
}