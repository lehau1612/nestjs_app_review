import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user_profile', schema: 'public' })
export class UserProfile{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({name:'user_id'})
    userId: number
    
    @Column({name:'email'})
    email : string
    
    @Column({name:'first_name'})
    firstName: string
    
    @Column({name:'last_name'})
    lastName: string
    
    @Column({name: 'dob', type : 'timestamptz'})
    dob : Date
    
    @Column({name: 'manager_id'})
    managerId : number

    @Column({name:'position'})
    position: string
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
    
    @Column({ name: 'created_by' })
    createdBy: string 
}