import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn } from 'typeorm';

@Entity({ name: 'groups', schema: 'public' })
export class Group{
    @PrimaryGeneratedColumn()
    id: number

    @Column({name:'name'})
    name : string
    
    @Column({name: 'code'})
    code : string
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date
    
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
    
    @Column({ name: 'created_by' })    
    createdBy: string 
}