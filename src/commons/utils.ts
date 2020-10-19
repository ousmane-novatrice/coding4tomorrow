import { GqlExecutionContext } from '@nestjs/graphql';
import { AnyObject } from '~/commons/typings/typescript';
import { ClientFilterInput } from '~/commons/graphql/types-and-inputs/client-filter.input';
import { forOwn, isEmpty, pull } from 'lodash';
import { defaultQueryLimit } from '~/commons/graphql/graphql-constants';
import { ExecutionContext } from '@nestjs/common';
import { OrderByDirection } from '~/commons/graphql/types-and-inputs/order-by-direction';
import { Validator } from 'class-validator';
import { Response } from 'express';

export function applyClientFilterToArray(
  array: any[],
  opts: ClientFilterInput,
): any[] {
  const offset = (!isEmpty(opts) && opts.offset) || 0;
  const limit = (!isEmpty(opts) && opts.limit) || defaultQueryLimit;
  const filter = opts.filter || {};

  const totalFilterParams = Object.keys(filter).length;
  let totalTakenForFilter = 0;

  return array.filter((item, index) => {
    // step 1: first apply filter by offset

    if (index < offset) {
      return false;
    }

    // step 2: first apply filter by limit

    totalTakenForFilter++;

    if (limit < totalTakenForFilter) {
      return false;
    }

    // step 3: filter by queryFilter params

    let matchedFilteredParams = 0;

    if (filter.id) {
      // there are no two elements with same id, so other queryFilter params are ignored
      return item.id === filter.id;
    }

    forOwn(filter, (value, key) => {
      if (item[key] === value) {
        matchedFilteredParams++;
      }
    });

    return matchedFilteredParams === totalFilterParams;
  });
}

/**
 *
 * @param inputFilter - object, that is passed with ClientFilterInput.filter
 * @param plainQueryFilter - simple key-value object, that is used in Service-type classes for strict comparison in db queries
 */
export function mergeQueryFilters(
  inputFilter: AnyObject,
  plainQueryFilter: AnyObject = {},
): AnyObject {
  if (plainQueryFilter.id) {
    plainQueryFilter._id = plainQueryFilter.id;
    delete plainQueryFilter.id;
  }
  return Object.assign(inputFilter, plainQueryFilter);
}




export function getArgsFromContext(context: ExecutionContext): AnyObject {
  return context.getArgs()[1];
}


export function normalizeClientFilterForSearch(
  clientFilter: ClientFilterInput = {},
): ClientFilterInput {
  const normalized: ClientFilterInput = {};

  if (clientFilter.offset === undefined) {
    normalized.offset = 0;
  } else {
    normalized.offset = clientFilter.offset;
  }

  if (clientFilter.limit === undefined || clientFilter.limit < 1) {
    normalized.limit = defaultQueryLimit;
  } else {
    normalized.limit = clientFilter.limit;
  }

  if (isEmpty(clientFilter.filter)) {
    normalized.filter = {};
  } else {
    normalized.filter = clientFilter.filter;
  }

  if (isEmpty(clientFilter.orderBy)) {
    normalized.orderBy = {
      property: 'updatedAt',
      direction: -1,
    };
  } else {
    const { property, direction } = clientFilter.orderBy;
    normalized.orderBy = {
      property,
      direction: direction === OrderByDirection.Asc ? 1 : -1,
    };
  }

  return normalized;
}

export function normalizeClientFilterForCount(
  clientFilter: ClientFilterInput = {},
) {
  const normalized = normalizeClientFilterForSearch(clientFilter);
  normalized.limit = Number.MAX_SAFE_INTEGER;
  return normalized;
}


export function isValidMongoId(str: string): boolean {
  const validator = new Validator();
  return validator.isMongoId(str);
}

export function pushIfNotContains(arr: any[], val: any): any[] {
  if (arr.length === pull(arr, val).length) {
    arr.push(val);
  }
  return arr;
}

export function getMajorityNumber(size: number): number {
  return Math.floor(size / 2) + 1;
}


export function popFirstPrimitive(array: any[], search: any): any[] {
  const index: number = array.indexOf(search);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
}

export function popFirst(array: any[], fn: (value: any) => boolean): any[] {
  let index: number = null;
  array.find((v, i) => {
    const found: any = fn(v);
    if (found === true) {
      index = i;
    }
    return Boolean(found);
  });
  if (index !== null) {
    array.splice(index, 1);
  }
  return array;
}

export function getRequestFromContext(
  context: ExecutionContext,
): any {
  return (
    context.switchToHttp().getRequest() ||
    GqlExecutionContext.create(context).getContext().req
  );
}

export function setupDownloadHeaders(
  res: Response,
  filename: string = 'unnamed',
  mimeType?: string,
): Response {
  res.set('Content-Type', mimeType || 'application/octet-stream');
  res.set('Content-Disposition', `attachment;filename=${filename}`);
  return res;
}

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}