export function fillEmptyItemsWithUndefined(arr: any[]): any[] {
  return arr.map((item) => (item === undefined ? undefined : item));
}
