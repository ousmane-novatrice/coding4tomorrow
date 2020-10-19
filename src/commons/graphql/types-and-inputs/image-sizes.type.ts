import { ApiProperty } from '@nestjs/swagger';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class ImageSizes {
  @ApiProperty({ description: 'small image size' })
  @Field(type => ID, { nullable: true })
  public sm: string;

  @ApiProperty({ description: 'medium image size' })
  @Field(type => ID, { nullable: true })
  public md: string;

  @ApiProperty({ description: 'large image size' })
  @Field(type => ID, { nullable: true })
  public lg: string;
}
