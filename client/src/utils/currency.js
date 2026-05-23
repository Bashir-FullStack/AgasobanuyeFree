export function toRWF(amount) {
  return `FRw ${Math.round(amount).toLocaleString()}`;
}
