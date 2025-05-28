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

export const removeFirstEmojiFromString = (str: string): string => {
  // Use a more comprehensive regex for ZWJ sequences and compound emojis
  const emojiRegex = /([\p{Emoji}\u200d\u20e3\ufe0f\u{1f3fb}-\u{1f3ff}]+)/u;
  const trimmedStr = str.trim();
  // Only replace the first match
  return trimmedStr.replace(emojiRegex, '').trim();
};

export const getFirstEmojiFromString = (str: string): string | undefined => {
  // Use a more comprehensive regex for ZWJ sequences and compound emojis
  const emojiRegex = /([\p{Emoji}\u200d\u20e3\ufe0f\u{1f3fb}-\u{1f3ff}]+)/u;
  const trimmedStr = str.trim();
  const match = trimmedStr.match(emojiRegex);
  return match ? match[0] : undefined;
};

export const isURL = (str: string): boolean => {
  // Improved URL regex to handle a wider variety of URL formats, but you can adjust according to your needs
  const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  return urlRegex.test(str);
};
