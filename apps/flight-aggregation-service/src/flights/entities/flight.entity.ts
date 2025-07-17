import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('flights')
@Index(['origin', 'destination', 'departureDate'])
@Index(['flightNumber', 'airline'])
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  flightNumber: string;

  @Column()
  airline: string;

  @Column()
  @Index()
  origin: string;

  @Column()
  @Index()
  destination: string;

  @Column('timestamp with time zone')
  @Index()
  departureDate: Date;

  @Column('timestamp with time zone')
  arrivalDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column()
  cabin: string; // economy, premium_economy, business, first

  @Column('int')
  availableSeats: number;

  @Column('int')
  duration: number; // in minutes

  @Column('int')
  stops: number;

  @Column('jsonb', { nullable: true })
  segments: Record<string, unknown>[];

  @Column('jsonb', { nullable: true })
  baggage: Record<string, unknown>;

  @Column('jsonb', { nullable: true })
  amenities: string[];

  @Column()
  @Index()
  source: string; // API source identifier

  @Column('timestamp with time zone')
  @Index()
  lastUpdated: Date;

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
