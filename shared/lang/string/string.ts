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
  // Use a more precise regex that excludes ASCII digits and letters
  // This regex matches emoji characters but excludes regular text and numbers
  const emojiRegex = /^(\s*)((?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}])(?:\u{200D}(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]))*(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u{FE0F})?(?:\u{20E3})?)/u;
  const trimmedStr = str.trim();
  // Only replace the first match
  return trimmedStr.replace(emojiRegex, '$1').trim();
};

export const getFirstEmojiFromString = (str: string): string | undefined => {
  // Use a more precise regex that excludes ASCII digits and letters
  // This regex matches emoji characters but excludes regular text and numbers
  const emojiRegex = /((?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}])(?:\u{200D}(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]))*(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u{FE0F})?(?:\u{20E3})?)/u;
  const trimmedStr = str.trim();
  const match = trimmedStr.match(emojiRegex);
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
