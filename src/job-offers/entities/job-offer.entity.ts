import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('job_offers')
export class JobOffer {
    @PrimaryColumn()
    id: string; // Unified ID (e.g., "P1-744" or "job-926")

    @Column()
    title: string; // "title" from Structure A, "position" from Structure B

    @Column({ nullable: true })
    location: string; // Combined location (e.g., "New York, NY" or "San Francisco, TX")

    @Column({ nullable: true })
    type: string; // "type" from Structure A, optional for Structure B

    @Column({ type: 'boolean', default: false })
    remote: boolean; // From Structure B, default to false if not provided

    @Column({ type: 'float', nullable: true })
    minSalary: number; // Parsed from "salaryRange" or "compensation.min"

    @Column({ type: 'float', nullable: true })
    maxSalary: number; // Parsed from "salaryRange" or "compensation.max"

    @Column({ nullable: true })
    currency: string; // From Structure B or inferred (e.g., "USD")

    @Column()
    companyName: string; // "company.name" from A, "employer.companyName" from B

    @Column({ nullable: true })
    industry: string; // From Structure A, optional

    @Column({ nullable: true })
    website: string; // From Structure B, optional

    @Column('text', { array: true })
    skills: string[]; // "skills" from A, "requirements.technologies" from B

    @Column({ type: 'int', nullable: true })
    experience: number; // From Structure B, optional

    @Column()
    postedDate: Date; // Parsed from both structures

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}