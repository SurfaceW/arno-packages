export const trimEmptyLines = (str: string, options?: {
  /**
   * Trim empty lines at the beginning of the string
   */
  start?: boolean;
  /**
   * Trim empty lines at the end of the string
   */
  end?: boolean;
}) => {
  const { start = true, end = true } = options || {};
  let trimmed = str;
  if (start) {
    trimmed = trimmed.replace(/^\s*[\r\n]/g, '');
  }
  if (end) {
    trimmed = trimmed.replace(/[\r\n]\s*$/g, '');
  }
  return trimmed;
}