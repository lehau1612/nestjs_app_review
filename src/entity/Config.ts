import { Column, Entity,CreateDateColumn, PrimaryGeneratedColumn,UpdateDateColumn} from 'typeorm';

@Entity({ name: 'config', schema: 'public' })
export class Config{
    @PrimaryGeneratedColumn()
    id: number
  
    @Column({name:'name'})
    name : string

    @Column({name: 'types'})
    types: string

    @Column({name: 'groups'})
    groups: string

    @Column ({name :'value'})
    value : number

    @Column({name:'value_type'})
    valueType: string
   
    @Column({name: 'priority'})
    priority : number

    @Column({name:'weight'})
    weight: number

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date

    @Column({ name: 'created_by' })
    createdBy: string  
    

}