'use server';

/**
 * @fileOverview AI-powered tool which makes suggestions based on layout of other elements to suggest number of seats, status and best possible dimensions.
 *
 * - suggestTableConfiguration - A function that suggests table configurations based on the surrounding layout and selected table type.
 * - SuggestTableConfigurationInput - The input type for the suggestTableConfiguration function.
 * - SuggestTableConfigurationOutput - The return type for the suggestTableConfiguration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTableConfigurationInputSchema = z.object({
  tableType: z.string().describe('The type of the table (e.g., Round Table, Square Table, Rectangle Table).'),
  surroundingLayout: z.string().describe('Description of the surrounding layout, including nearby elements like walls, doors, and other tables.'),
});
export type SuggestTableConfigurationInput = z.infer<typeof SuggestTableConfigurationInputSchema>;

const SuggestTableConfigurationOutputSchema = z.object({
  suggestedSeats: z.number().describe('The suggested number of seats for the table.'),
  suggestedWidth: z.number().optional().describe('The suggested width of the table in inches.'),
  suggestedHeight: z.number().optional().describe('The suggested height of the table in inches.'),
  suggestedRadius: z.number().optional().describe('The suggested radius of the table in inches.'),
});
export type SuggestTableConfigurationOutput = z.infer<typeof SuggestTableConfigurationOutputSchema>;

export async function suggestTableConfiguration(input: SuggestTableConfigurationInput): Promise<SuggestTableConfigurationOutput> {
  return suggestTableConfigurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTableConfigurationPrompt',
  input: {schema: SuggestTableConfigurationInputSchema},
  output: {schema: SuggestTableConfigurationOutputSchema},
  prompt: `You are an AI assistant that suggests optimal table configurations for floor plans.

  Given the table type and the surrounding layout, suggest the best number of seats, width, height, or radius for the table.
  The dimensions should be appropriate for the type of table and also take into account the description of the surrounding area to make sure it is not too large.

  Table Type: {{{tableType}}}
  Surrounding Layout: {{{surroundingLayout}}}

  Consider:
  - Available space in the surrounding layout.
  - Common dimensions for the given table type.
  - Number of seats that would comfortably fit at the table.
  - Be as specific as possible with dimensions - i.e. if width and height can be specified for a rectangular table, do so instead of radius.

  Return the suggested number of seats, width, height and radius.
  Do not return measurements that are physically impossible (i.e. negative numbers, 0).`,
});

const suggestTableConfigurationFlow = ai.defineFlow(
  {
    name: 'suggestTableConfigurationFlow',
    inputSchema: SuggestTableConfigurationInputSchema,
    outputSchema: SuggestTableConfigurationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
