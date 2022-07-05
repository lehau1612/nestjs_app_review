import { Column, Entity , CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn} from 'typeorm';

@Entity({ name: 'result', schema: 'public' })
export class Result{
    @PrimaryGeneratedColumn()
    id: number
  
    @Column({name:'config_id'})
    configId: number
    
    @Column({name: 'user_id'})
    userId: number
    
    @Column ({name :'description'})
    description : string
    
    @Column ({name: 'point_manager', type: 'decimal', precision:5 , scale : 2})
    pointManager: number
    
    @Column({name: 'point_self', type: 'decimal', precision:5 , scale: 2})
    pointSelf: number
    
    @Column({name:'manager_id'})
    managerId: number


    
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
    
    @Column({ name: 'created_by' })
    createdBy: string 

}