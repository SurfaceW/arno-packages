import { parseJSONObjectSafe } from "@arno/shared";
import { get } from "lodash";

export const STREAM_START_FLAG = 'stream.start';
export const STREAM_END_FLAG = 'stream.end';

/**
 * Accept an Async Iterable and return another Async Iterable that will
 * consume the full incremental output object
 */
export async function* processAsyncIterableObjectTextStream<T extends Record<string, any> = any>(asyncIterable: AsyncIterable<string | undefined>, options: {
  checkKeys: string[];
  listKeyPath: string[];
}) {
  let lastLength = 0;
  let lastParsedList: T[] = [];
  for await (let chunk of asyncIterable) {
    if (chunk === STREAM_START_FLAG) {
      console.info('🚀 Stream started');
      continue;
    }
    // Extract JSON part from the string
    try {
      if (chunk === STREAM_END_FLAG) {
        // pop the last item as it is the end flag
        yield lastParsedList[lastParsedList.length - 1];
        console.info('🚀 Stream ended');
        break;
      }
      const parsed = parseJSONObjectSafe<T[]>(chunk);
      const parsedList = get(parsed, options.listKeyPath, []);
      lastParsedList = parsedList;
      if (!parsedList.length || parsedList.length <= 1) {
        continue;
      }
      const currentLength = parsedList.length;
      // Check if the array length has increased
      if (currentLength > lastLength) {
        lastLength = currentLength;
        // Check if the last quote in the list is complete
        const completeItem = parsedList[currentLength - 2];
        const isComplete = options.checkKeys.every(key => completeItem.hasOwnProperty(key));
        if (isComplete) {
          yield completeItem;
        } else {
          console.warn('📣 Incomplete item:', completeItem);
        }
      }
    } catch (e) {
      // Ignore JSON parse errors as we might not have complete data yet
      console.error(e);
    }
  }
}