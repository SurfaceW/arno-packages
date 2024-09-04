import type { CoreTool, LanguageModel } from 'ai';
import { ComponentType, SupportedValueType } from '../../form/dynamic-form/dynamic-form.base.type';

/**
 * API spec is learnt from:
 * - OpenAI: https://platform.openai.com/docs/api-reference/assistants/object
 * - AI SDK:  https://sdk.vercel.ai/docs/introduction
 * - LangChain: https://api.python.langchain.com/en/latest/langchain_api_reference.html#module-langchain.agents
 */
export type AIAgentRuntimeType<AgentState = any> = {
  /**
   * cuid for the agent
   */
  id: string;
  /**
   * The type of the agent
   * - `open-ai-assistant` OpenAI GPT powered assistant
   * - `agent` Custom agent powered by ai-sdk of vercel
   */
  type: 'agent' | 'open-ai-assistant';
  /**
   * The name of the assistant. The maximum length is 256 characters.
   */
  name: string;
  /**
   * The description of the assistant. The maximum length is 512 characters.
   */
  description: string;
  /**
   * ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them.
   */
  model: string;
  modelConfig?: {
    /**
     * The language model to use. same with `model`
     */
    modelId?: string;
    /**
     * use streaming response or not
     */
    stream?: boolean;
    /**
     * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature?: number;
    /**
     * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.
     * So 0.1 means only the tokens comprising the top 10% probability mass are considered.
     * We generally recommend altering this or temperature but not both.
     */
    topP?: number;
    /**
     * pecifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since gpt-3.5-turbo-1106.
     * Setting to { "type": "json_object" } enables JSON mode, which guarantees the message the model generates is valid JSON.
     */
    responseFormat?: {
      type: 'text' | 'json_object';
    };
    /**
     * Tools are additional models that can be used to provide more specific functionality.
     * this is the uid of the tool
     */
    tools?: string[];
    /**
     * The configuration for the tools.
     */
    toolConfig?: {
      [toolID: string]: Record<string, any>;
    }
    /**
     * use web-search model or not
     */
    webSearch?: boolean;
  };
  /**
   * instructions is the text that the assistant will use to generate the response.
   */
  instructions?: {
    /**
     * The system instructions that the assistant uses. The maximum length is 256,000 characters.
     */
    instruction?: string;
    /**
     * The system information injected into the instructions.
     * - if `{{__system__}}` variable is used in the instructions, the system information will be injected into the instructions.
     * - else it will inject into the top of the instructions.
     */
    presetInfo?: {
      /**
       * The system information that the assistant uses.
       * - `dateAndTime` - The current date and time.
       */
      dateAndTime?: boolean;
      /**
       * The system information that the assistant uses.
       * - `navigator` The user's location and timezone and language and currency.
       */
      navigator?: boolean;
      /**
       * The system information that the assistant uses.
       * - user's custom information injected into the instructions.
       */
      user?: boolean;
    };
    variable?: {
      /**
       * default is `{{` and `}}` for mustache template
       */
      syntaxRegex?: string;
    };
    /**
     * Docs as reference for the instructions
     */
    elaborationDocs?: string[];
    /**
     * The markdown parser options for the instructions.
     */
    markdown?: {
      parseLink?: boolean;
      parseImage?: boolean;
      parseVideo?: boolean;
      parseAudio?: boolean;
    };
  };
  /**
   * Set of 16 key-value pairs that can be attached to an object.
   * This can be useful for storing additional information about the object in a structured format.
   * Keys can be a maximum of 64 characters long and values can be a maxium of 512 characters long.
   */
  metadata?: {
    /**
     * Agent input description
     */
    input?: AgentManifestParameterType[];
    /**
     * Agent output description
     */
    output?: AgentManifestParameterType[];
    /**
     * Enable structured output or not
     * - if enabled, the output will be in JSON format and described by `output` field
     */
    structuredOutput?: boolean;
    structuredInput?: boolean;
  } & {
    /**
     * emoji icon for the agent
     */
    icon?: string;
  };
  /**
   * @reserve for x-state integration
   * its state snapshot
   */
  state?: AgentState;
};

export type AgentManifestParameterType = {
  name: string;
  desc: string;
  required: boolean;
  type: SupportedValueType;
};
