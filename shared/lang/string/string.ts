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
  // The regex will match all forms of emojis including compound ones
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|(\p{Emoji}|\p{Emoji_Modifier}|\p{Emoji_Component})+)/gu;
  const trimmedStr = str.trim();
  return trimmedStr.replace(emojiRegex, '').trim();
};

export const getFirstEmojiFromString = (str: string): string | undefined => {
  // The regex will match all forms of emojis including compound ones
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|(\p{Emoji}|\p{Emoji_Modifier}|\p{Emoji_Component})+)/gu;
  const trimmedStr = str.trim();
  const match = trimmedStr.match(emojiRegex);
  return match ? match[0] : undefined;
};

export const isURL = (str: string): boolean => {
  // Improved URL regex to handle a wider variety of URL formats, but you can adjust according to your needs
  const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  return urlRegex.test(str);
};
