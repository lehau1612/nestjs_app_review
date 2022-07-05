import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user_role', schema: 'public' })
export class UserRole{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({name: 'role_id'})
    roleId : number

    @Column({name:'user_id'})
    userId : number

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
    
    @Column({ name: 'created_by' })
    createdBy: string 
}