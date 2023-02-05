/* eslint-disable prettier/prettier */
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from "src/common/constants";
import { ProfileEntity } from "src/modules/profile/profile.entity";
import { OneToOne } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;   

    @OneToOne(() => ProfileEntity, (profile) => profile.user)
    profile:ProfileEntity;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    password: string;

    @Column('enum', { enum: UserRole })
    role: UserRole;

    @Column({ default: UserStatus.NEW })
    status: UserStatus;

    @Column({ name: 'is_delete',default:false})
    isDelete: boolean

    @Column({name: 'created_by', nullable: true})
    createdBy?: string;

    @Column({ name: 'updated_by', nullable: true })
    updatedBy?: string;

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    updatedDate?: Date;

    @Column({nullable: true})
    OTP?: number

    @Column({ name: 'otp_time', nullable: true})
    otpTime: number

    @BeforeInsert() async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
