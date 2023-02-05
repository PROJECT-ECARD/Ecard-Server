/* eslint-disable prettier/prettier */
import { ProfileEntity } from "src/modules/profile/profile.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'relationship' })
export class RelationshipEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => ProfileEntity, (profile) => profile.id, {nullable: false, eager: true })
  @JoinColumn({ name: 'sender_id'})
  senderId: ProfileEntity;

  @ManyToOne(() => ProfileEntity, (profile) => profile.id, { nullable: false, eager: true })
  @JoinColumn({ name: 'receiver_id'})
  receiverId: ProfileEntity;

  @Column({ name: 'is_friend', nullable: true, default: false })
  isFriend: boolean;
}