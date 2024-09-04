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
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?)/u;
  return str.trim().replace(emojiRegex, '').trim();
};

export const getFirstEmojiFromString = (str: string): string | undefined => {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?)/u;
  const match = str.trim().match(emojiRegex);
  return match ? match[0] : undefined;
}