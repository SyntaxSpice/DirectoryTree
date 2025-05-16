const get = (obj: any, path: string) =>
  path.split('.').reduce((o, k) => o?.[k], obj);

const sortByPath =
  (path: string, order: 'asc' | 'desc' = 'asc') =>
  (a: any, b: any) => {
    const valA = get(a, path);
    const valB = get(b, path);
    return valA > valB
      ? order === 'asc'
        ? 1
        : -1
      : valA < valB
      ? order === 'asc'
        ? -1
        : 1
      : 0;
  };

export { sortByPath };
