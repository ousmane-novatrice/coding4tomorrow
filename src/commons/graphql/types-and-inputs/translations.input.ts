import { Field, InputType } from 'type-graphql';

@InputType()
export class TranslationsInput {
  @Field({ nullable: true })
  public en: string;

  @Field({ nullable: true })
  public fr: string;

  @Field({ nullable: true })
  public ar: string;
}
