import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('job_offers')
export class JobOffer {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    location: string | null; // Adjusted to allow null

    @Column({ nullable: true })
    type: string | null; // Adjusted to allow null

    @Column({ type: 'boolean', default: false })
    remote: boolean;

    @Column({ type: 'float', nullable: true })
    minSalary: number | null; // Adjusted to allow null

    @Column({ type: 'float', nullable: true })
    maxSalary: number | null; // Adjusted to allow null

    @Column({ nullable: true })
    currency: string | null; // Adjusted to allow null

    @Column()
    companyName: string;

    @Column({ nullable: true })
    industry: string | null; // Adjusted to allow null

    @Column({ nullable: true })
    website: string | null; // Adjusted to allow null

    @Column('text', { array: true })
    skills: string[];

    @Column({ type: 'int', nullable: true })
    experience: number | null; // Adjusted to allow null

    @Column()
    postedDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}