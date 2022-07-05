import { Column, Entity , CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn} from 'typeorm';
import { IsEmail ,IsNotEmpty } from 'class-validator';
@Entity({ name: 'users', schema: 'public' })
export class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({name : 'email', unique: true}) 
    email : string;
    
    @Column('text') 
    password: string; 
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
    
    @Column({ name: 'created_by', unique: false })
    createdBy: string 

}