import { registerEnumType } from 'type-graphql';

export enum BookType {
    Public = 'Public',
    Private = 'Private',
}

registerEnumType(BookType, {
    name: 'BookType',
});
