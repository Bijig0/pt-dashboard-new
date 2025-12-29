function getFromLocalStorage(key: any) {
  const result = localStorage.getItem(key);
  return result;
}

export default getFromLocalStorage;
