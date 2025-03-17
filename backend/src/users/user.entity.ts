import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FavoriteCity } from '../favorite-city/favorite-city.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  confirmed: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'text', nullable: true })
  mailToken?: string | null;

  @OneToMany(() => FavoriteCity, (favoriteCity) => favoriteCity.user)
  favoriteCities: FavoriteCity[];
} 
