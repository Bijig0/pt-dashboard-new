import { LocalStorageKeys } from "../../types/globals";

function getTokens<T extends keyof Omit<LocalStorageKeys, "workbooks">>(
  key: T
): LocalStorageKeys[T] | null {
  const result = localStorage.getItem(key);
  return result;
}

export default getTokens;
