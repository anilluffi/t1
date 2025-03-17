import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('favorite_cities')
export class FavoriteCity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favoriteCities, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  city_name: string;
}
