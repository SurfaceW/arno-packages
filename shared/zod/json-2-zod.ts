import * as z from 'zod';
import { jsonSchemaToZod, JsonSchema } from 'json-schema-to-zod';
import { AgentManifestParameterType } from '../ai/agents/agent.manifest';

/**
 * @caution This function is not safe to use in production.
 * - it use `eval` to convert json schema to zod schema runtime object
 */
// export function convertJsonToZodSchema(
//   jsonSchema: JsonSchema,
// ) {
//   // we assume that jsonToZodSchema will return a valid ZodType
//   return eval(jsonSchemaToZod(jsonSchema, { module: 'esm' })) as z.ZodAny;
// }



// Implement the function to convert form props to Zod schema
export function convertDynamicFormPropsToZodSchema(formProps: AgentManifestParameterType[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  formProps.forEach((prop) => {
    switch (prop.type) {
      case 'string':
        shape[prop.name] = z.string().describe(prop.desc || '');
        break;
      case 'number':
        shape[prop.name] = z.number().describe(prop.desc || '');
        break;
      case 'boolean':
        shape[prop.name] = z.boolean().describe(prop.desc || '');
        break;
      default:
        shape[prop.name] = z.string().describe(prop.desc || '');
    }
  });

  return z.object(shape);
}
