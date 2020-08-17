export function gridListResize(currentValue: number, maxWindowSize: number, maxCols: number): number{

  return Math.ceil((currentValue / maxWindowSize * maxCols));

}
