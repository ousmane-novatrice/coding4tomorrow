import { IsOptional, Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { AnyObject } from '~/commons/typings/typescript';
import { Any } from '../scalars/any.scalar';
import { OrderByInput } from '~/commons/graphql/types-and-inputs/order-by.input';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class ClientFilterInput {
  @ApiProperty()
  @Field(type => Int, { nullable: true })
  @Min(0)
  @IsOptional()
  public offset?: number;

  @ApiProperty()
  @Field(type => Int, { nullable: true })
  @Min(1)
  @IsOptional()
  public limit?: number;

  @ApiProperty()
  @Field(type => Any, { nullable: true })
  public filter?: AnyObject;

  @ApiProperty()
  @Field(type => String, { nullable: true })
  public search?: string;

  @ApiProperty()
  @Field(type => OrderByInput, { nullable: true })
  public orderBy?: OrderByInput;
}
