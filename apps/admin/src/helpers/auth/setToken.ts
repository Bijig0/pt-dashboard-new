import { LocalStorageKeys } from "../../types/globals";

function setToken<T extends keyof Omit<LocalStorageKeys, "workbooks">>(
  key: T,
  value: LocalStorageKeys[T]
): void {
  localStorage.setItem(key, value);
}

export default setToken;
