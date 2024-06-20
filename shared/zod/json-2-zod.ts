import * as z from 'zod';
import { jsonSchemaToZod, JsonSchema } from 'json-schema-to-zod';

/**
 * @caution This function is not safe to use in production.
 * - it use `eval` to convert json schema to zod schema runtime object
 */
export function convertJsonToZodSchema(
  jsonSchema: JsonSchema,
) {
  // we assume that jsonToZodSchema will return a valid ZodType
  return eval(jsonSchemaToZod(jsonSchema, { module: 'esm' })) as z.ZodAny;
}