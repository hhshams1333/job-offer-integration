import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('job_offers')
export class JobOffer {
    @PrimaryColumn()
    @Index({ unique: true }) // Ensure no duplicate IDs
    id: string;

    @Column()
    @Index() // Index for filtering by title
    title: string;

    @Column({ nullable: true })
    @Index() // Index for filtering by location
    location: string | null;

    @Column({ nullable: true })
    type: string | null;

    @Column({ type: 'boolean', default: false })
    remote: boolean;

    @Column({ type: 'float', nullable: true })
    minSalary: number | null;

    @Column({ type: 'float', nullable: true })
    maxSalary: number | null;

    @Column({ nullable: true })
    currency: string | null;

    @Column()
    companyName: string;

    @Column({ nullable: true })
    industry: string | null;

    @Column({ nullable: true })
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