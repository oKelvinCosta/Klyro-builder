
/**
 * Personal debug logging utility that outputs messages to the console
 * @param args - Any values to be logged, accepts multiple arguments of any type
 */
function debug(...args: any[]) {
  if (typeof process !== 'undefined' && process.env?.DEBUG === 'true') {
    console.log(...args);
  }
}

export { debug };

