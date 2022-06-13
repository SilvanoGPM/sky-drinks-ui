export default class Repository {
  static save<T>(key: string, value: Record<string, unknown> | T): void {
    const valueString = JSON.stringify(value);

    localStorage.setItem(key, valueString);
  }

  static get<T>(key: string): T | null | undefined {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }
}
