// Teaching fixture: total intentionally ignores quantity. Fix this function.
export function total(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
