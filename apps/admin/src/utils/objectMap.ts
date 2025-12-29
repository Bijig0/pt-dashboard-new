/**
 * Maps over the values of an object and returns a new object with the same keys.
 *
 * @template T The type of the input object
 * @template U The type of the output object's values
 * @param {T} obj The input object
 * @param {(value: T[keyof T], key: keyof T, index: number) => U} fn The mapping function
 * @returns {Record<keyof T, U>} A new object with the same keys as the input and mapped values
 */
const objectMap = <T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T, index: number) => U
): Record<keyof T, U> =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v], i) => [
      k,
      fn(v as T[keyof T], k as keyof T, i),
    ])
  ) as Record<keyof T, U>;

export default objectMap;
