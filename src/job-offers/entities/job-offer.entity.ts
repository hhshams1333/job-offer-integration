import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('job_offers')
export class JobOffer {
    @PrimaryColumn()
    @Index({ unique: true })
    id: string;

    @Column()
    @Index()
    title: string;

    @Column({ type: 'text', nullable: true })
    @Index()
    location: string | null;

    @Column({ type: 'text', nullable: true })
    type: string | null;

    @Column({ type: 'boolean', default: false })
    remote: boolean;

    @Column({ type: 'float', nullable: true })
    minSalary: number | null;

    @Column({ type: 'float', nullable: true })
    maxSalary: number | null;

    @Column({ type: 'text', nullable: true })
    currency: string | null;

    @Column()
    companyName: string;

    @Column({ type: 'text', nullable: true })
    industry: string | null;

    @Column({ type: 'text', nullable: true })
    website: string | null;

    @Column('text', { array: true })
    skills: string[];

    @Column({ type: 'int', nullable: true })
    experience: number | null;

    @Column()
    postedDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}