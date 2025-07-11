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
  // Use a more precise approach to match complete emoji sequences
  const emojiSequenceRegex = /(?:[\u{1F1E0}-\u{1F1FF}]{2}|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{23E9}-\u{23EF}]|[\u{25B6}]|[\u{23F8}-\u{23FA}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}]|[\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}]|[\u{2B1C}]|[\u{3297}]|[\u{3299}]|[\u{303D}]|[\u{2122}]|[\u{23F3}]|[\u{24C2}]|[\u{20E3}])(?:[\u{FE0F}])?(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u{200D}(?:[\u{1F1E0}-\u{1F1FF}]{2}|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])(?:[\u{FE0F}])?(?:[\u{1F3FB}-\u{1F3FF}])?)*|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F170}-\u{1F251}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F18E}]|[\u{3030}]/gu;

  const match = str.match(emojiSequenceRegex);
  if (match) {
    return str.replace(match[0], '').trim();
  }
  return str;
};

export const getFirstEmojiFromString = (str: string): string | undefined => {
  // Use a more precise approach to match complete emoji sequences
  const emojiSequenceRegex = /(?:[\u{1F1E0}-\u{1F1FF}]{2}|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{23E9}-\u{23EF}]|[\u{25B6}]|[\u{23F8}-\u{23FA}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}]|[\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}]|[\u{2B1C}]|[\u{3297}]|[\u{3299}]|[\u{303D}]|[\u{2122}]|[\u{23F3}]|[\u{24C2}]|[\u{20E3}])(?:[\u{FE0F}])?(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u{200D}(?:[\u{1F1E0}-\u{1F1FF}]{2}|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])(?:[\u{FE0F}])?(?:[\u{1F3FB}-\u{1F3FF}])?)*|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F170}-\u{1F251}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F18E}]|[\u{3030}]/gu;

  const match = str.match(emojiSequenceRegex);
  return match ? match[0] : undefined;
};

export const isURL = (str: string): boolean => {
  // Handle null/undefined inputs
  if (str == null) {
    return false;
  }

  // Improved URL regex that handles query parameters and fragments
  // Only allows http/https protocols, proper domain structure, and valid characters
  const urlRegex = /^https?:\/\/[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(\:[0-9]{1,5})?(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?(\?[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?(\#[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?$/;
  return urlRegex.test(str);
};
