import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn } from 'typeorm';

@Entity({ name: 'roles', schema: 'public' })
export class Role  {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column({ name: 'names' })
    names: string
    
    @Column({ name: 'code'})
    code: string
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
    
    @Column({ name: 'created_by' })
    createdBy: string 

}