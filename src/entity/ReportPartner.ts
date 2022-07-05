import { Column, Entity , CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn} from 'typeorm';

@Entity({ name: 'report_partner', schema: 'public' })
export class ReportPartner {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name:'user_id'})
    userId: number
    
    @Column({name:'partner_id'})
    partnerId: number
    
    
    @Column({name:'feedback'})
    feedback: string
    
    @Column({name: 'point_attitude', type: 'decimal', precision:5 , scale : 2})
    pointAttitude: number
    
    @Column({name:'point_teamwork', type: 'decimal', precision: 5, scale: 2 })
    pointTeamwork : number

    @Column({name:'point_total',type:'decimal',precision:5, scale:2})
    pointTotal: number
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date
    
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
    
    @Column({ name: 'created_by' })
    createdBy: string 
}