import { AnyObject } from '~/commons/typings/typescript';

// toDO: implement better implementation for Query type
// so it could understand that the Query is actually MongoDB Aggregation Query
// https://edacysn.atlassian.net/browse/OP-1762
export type AggregationQuery = AnyObject[];

export type AggregationResult = AnyObject[];

export const mongoConnectionOptions = {
  poolSize: 2,
};
