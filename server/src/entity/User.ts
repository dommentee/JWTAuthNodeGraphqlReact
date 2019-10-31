import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()//important
@Entity("users")// query users in user resolver, querry all users
export class User extends BaseEntity {
    @Field(() => Int)// field queryable
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;

    @Column()//coulun not querable
    password: string;

}
