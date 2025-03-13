import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ nullable: true })
  City: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  confirmed: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: "text", nullable: true }) 
  mailToken?: string | null;
}
