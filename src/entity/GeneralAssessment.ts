import { Column, Entity,CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn} from 'typeorm';

@Entity({ name: 'general_assessment', schema: 'public' })
export class GeneralAssessment {

    @PrimaryGeneratedColumn()
    id: number

    @Column({name:'user_id'})
    userId: number

    @Column({name: 'content'})
    content: string

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date

    @Column({ name: 'created_by' })
    createdBy: string  
}