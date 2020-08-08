/**
 * Enumeration of currecies that can be used inside the application
 */
export enum Currency {
  EUR,
  USD
}

/**
 * Maps currencies to their symbols to ensure correct display.
 */
export const currencyMap = ['€', '$'];

/**
 * Maps currencies to symbol positions relative to the amount to ensure correct display.
 */
export const symbolBeforeAmount = [false, true];
