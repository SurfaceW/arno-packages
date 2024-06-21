/**
 * LLM invocation shared logic & models
 */
export type LLMPromptInvocationOptions = {
  /**
   * use search tool to find related content
   * - when call generate object, use Search API need to support tool-call or response_format better with OpenAI latest version of llm.
   */
  useSearch?: boolean;
  /**
   * need to extract the image from the markdown string prompt
   * - make sure the message content is markdown string
   */
  useExtractedMarkdownImages?: boolean;
  extractImageOptions?: {
    /**
     * by default, only extract the last message's image
     */
    extractAll?: boolean;
  };
  /**
   * need to extract the links from the markdown string prompt
   * use web-crawler to extract the links and fetch the content
   */
  useExtractedMarkdownLinks?: boolean;

  /**
   * check the length of the prompt is valid or not
   * - need to fit the model max_tokens
   */
  useContentLengthChecker?: boolean;
  /**
   * need to compress the content before sending to the model
   * - use the `contentCompressorOptions` to set the strategy
   */
  useContentCompressor?: boolean;
  contentCompressorOptions?: {
    /**
     * the strategy to compress the content
     * - truncate: truncate the message count till fit the max_tokens of the model
     * - llm-summary: use the model to generate the summary for context part
     */
    strategy: 'truncate' | 'llm-summary';
  };
  /**
   * need to use the token consumer to manage the usage of the token
   * - use the `tokenConsumerOptions` to set the token consumer id
   */
  useTokenConsumer?: boolean;
  /**
   * need to use the tools invoke in llm
   */
  useTools?: boolean;
  tools?: Array<{
    uid: string;
  }>;
  /**
   * the token consumer options
   */
  tokenConsumerOptions?: {
    /**
     * the token consumer id
     */
    userId: string;
    /**
     * the token consumer model to count the token usage and its price
     */
    model: any;
    /**
     * the token consumer key
     */
    userOrgId?: string;
  };
};