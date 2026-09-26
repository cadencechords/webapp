import type { Id } from '../types';

export function isEmpty(object: object) {
  return Object.keys(object).length === 0;
}

export function combineParamValues(paramName: string, values: readonly Id[]) {
  let combined = paramName;
  combined += values.join('&' + paramName);
  return combined;
}

/** Decides whether a field changed, given its incoming and original values. */
export type FieldComparator<V> = (incomingValue: V, originalValue: V) => boolean;

/**
 * Comparators for the fields that need more than `!==`. A comparator can also
 * name a field `T` only sometimes has (it's only called for fields on
 * `incoming`).
 */
export type FieldComparators<T> = {
  [K in keyof T]?: FieldComparator<T[K]>;
} & { [field: string]: FieldComparator<never> | undefined };

export function getModifiedFields<T extends object>(
  incoming: T,
  original: T,
  comparators: FieldComparators<T>
) {
  // Object.keys lists incoming's own fields, which are fields of T.
  const fieldsOnIncoming = Object.keys(incoming) as (keyof T & string)[];

  const modifiedValues: Partial<T> = {};

  fieldsOnIncoming.forEach(field => {
    if (comparators[field]) {
      const compareFunction = comparators[field];
      if (compareFunction(incoming[field], original[field])) {
        modifiedValues[field] = incoming[field];
      }
    } else if (incoming[field] !== original[field]) {
      modifiedValues[field] = incoming[field];
    }
  });

  return modifiedValues;
}
