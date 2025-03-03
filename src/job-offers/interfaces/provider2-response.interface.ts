export interface Provider2Response {
    status: string;
    data: {
        jobsList: {
            [key: string]: Provider2Job;
        };
    };
}

export interface Provider2Job {
    position: string;
    location: {
        city: string;
        state: string;
        remote: boolean;
    };
    compensation: {
        min: number;
        max: number;
        currency: string;
    };
    employer: {
        companyName: string;
        website: string;
    };
    requirements: {
        experience: number;
        technologies: string[];
    };
    datePosted: string;
}