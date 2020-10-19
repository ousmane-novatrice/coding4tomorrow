import { GraphQLScalarType, Kind } from 'graphql';

export const JsonString = new GraphQLScalarType({
  name: 'JsonString',
  description:
    'A custom type, that represents a string, that contains JSON-structured data',

  parseValue(value: string): any {
    return JSON.parse(value); // value from the client
  },

  serialize(value: any): string {
    return JSON.stringify(value); // value sent to the client
  },

  parseLiteral(ast: any) {
    if (typeof ast === 'string') {
      return JSON.parse(ast); // value from the client query
    }
    return null;
  },
});
