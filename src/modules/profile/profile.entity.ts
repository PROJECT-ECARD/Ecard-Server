/* eslint-disable prettier/prettier */
import { RelationshipEntity } from "src/modules/relationship/entities/relationship.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Entity, OneToMany, OneToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'profile' })
export class ProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => RelationshipEntity, (relation) => relation.senderId)
    listSenders: RelationshipEntity[]


    @OneToMany(() => RelationshipEntity, (relation) => relation.receiverId)
    listReceivers: RelationshipEntity[]

    @Column({
        type: "varchar",
        name: "first_name",
        nullable: true
    })

    firstName: string;

    @Column({
        type: "varchar",
        name: "last_name",
        nullable: true

    })
    lastName: string;

    @Column({
        type: "varchar",
        name: "phone_number",
        length: 10,
        nullable: true
    })
    phoneNumber: string;

    @Column({ name: 'business_name', default: "" })
    businessName?: string;

    @Column({ nullable: true, default: "" })
    description: string;

    @Column({ nullable: true, default: "" })
    address: string;

    @Column({ nullable: true, default: "" })
    website: string;

    @Column({ nullable: true, default: "" })
    avatar: string;

    @Column({ name: 'cover_image', nullable: true, default: "" })
    coverImage: string;

    @Column({ name: 'background_color', nullable: true, default: "" })
    backgroundColor: string;

    @Column({ name: 'text_color', nullable: true, default: "" })
    textColor: string;

    @Column({ name: 'qr_code', default: "" })
    qrCode: string;

    @Column({ nullable: true, default: "" })
    zalo: string;

    @Column({ nullable: true, default: "" })
    whatapps: string;

    @Column({ nullable: true, default: "" })
    telegram: string;

    @Column({ nullable: true, default: "" })
    skype: string;

    @Column({ nullable: true, default: "" })
    facebook: string;

    @Column({ nullable: true, default: "" })
    instagram: string;

    @Column({ nullable: true, default: "" })
    twitter: string;

    @Column({ nullable: true, default: "" })
    linkedin: string;

    @Column({ nullable: true, default: "" })
    momo: string;

    @Column({ nullable: true, default: "" })
    zalopay: string;

    @CreateDateColumn({ name: 'created_date' })
    createdDate: Date;

    @Column({ name: 'created_by', nullable: true, default: "" })
    createdBy: string;

    @Column({ name: 'is_deleted', default: false })
    isDelete: boolean;

    @UpdateDateColumn({ name: 'updated_date' })
    updatedDate: Date;

    @Column({ name: 'updated_by', nullable: true, default: "" })
    updatedBy: string;

    @OneToOne(() => UserEntity, (user) => user.profile,)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity

}