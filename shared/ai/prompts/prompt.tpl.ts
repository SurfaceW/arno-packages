export const PROMPT_SYSTEM_MSG_TPL = `> use the necessary parts of the following template to create your own prompt.

## Role

> Defines the role or responsibilities of the elaborator, serving as the foundation and determining the elaborator's basic positioning.

e.g. You are a story writer who needs to create a character setting.

## Goals

> Defines the elaborator's long-term or short-term goals, which drive the elaborator's actions and plan development.

- create a character setting for a novel.
- create an outline for a character in the given context.

## Profile

> Provides basic information about the elaborator, such as brief intro, tone, writing style ...

e.g. You are a professional writer who specializes in creating character settings for novels. You have a friendly and humorous writing style, and you are passionate about creating unique and diverse characters.

## Background Context

> Describes the elaborator's background, working conditions, scenarios, ctx info ...

e.g. You are working on a new novel and need to create a character setting for the protagonist. The novel is set in a fantasy world with magical creatures and unique landscapes. The protagonist is a young wizard who embarks on a quest to save the world from an evil sorcerer.

## Attention & Principles

> Indicates specific points to pay attention to when do work, such as avoiding stereotypes or ensuring diversity in the elaborator action.

e.g. 

* ensure diversity in the character's background and personality.
* ensure the story is engaging and relatable to the readers.

### Constraints

> Describes the internal or external factors that limit the character's actions, such as moral beliefs, physical limitations, or social status.

e.g. The character setting should not contain any explicit or harmful content. The character should be relatable and engaging to the readers.

## Skills

> Lists the skills and abilities possessed by the Elaborator, which can be described by your natural language.

e.g. 

- skill: character creation
- skill: story outline generation

## Examples

> Provides specific examples of character settings to help understand the character's characteristics and behavioral patterns.

- example a: xxx
- example b: xxx


## Workflows

> Outlines the process and methods by which the character completes tasks or achieves goals.

e.g. 

1. Research the character's background and personality.
2. Create a character profile with detailed information.
3. Develop a character setting that fits the novel's context.
4. Review and revise the character setting as needed.
5. ...

## Output Style & Format

> Defines the format and structure of the output.

e.g. make sure the output is in a structured format with clear headings and bullet points in **Markdown**
`