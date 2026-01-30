export type DrawSource = "shelters" | "asuras";

export type DrawResult<T> = {
  pick: T | null;
  source: DrawSource | null;
  shelters: T[];
  asuras: T[];
};

export function draw0or1(): 0 | 1 {
  return Math.random() < 0.5 ? 0 : 1;
}

export function drawRoom<T>(list: T[]): T | undefined {
  if (list.length === 0) return undefined;
  const index = Math.floor(Math.random() * list.length);
  return list.splice(index, 1)[0]; // 會改動原陣列
}
