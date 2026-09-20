import type { SmplrspaceDefinition } from './types/SmplrspaceDefinition';

export class SmplrspaceDefinitionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SmplrspaceDefinitionValidationError';
  }
}

/**
 * Validates and parses unknown JSON into an SmplrspaceDefinition,
 * failing with an actionable SmplrspaceDefinitionValidationError rather
 * than letting a malformed payload surface as a raw runtime TypeError
 * (e.g. "Cannot use 'in' operator to search for 'levels' in undefined").
 *
 * Only the top-level shape is validated in Phase 1 -- levels/walls/
 * segments/openings are trusted structurally once `levels` is confirmed
 * to be an array. Deeper validation is intentionally deferred.
 */
export class SmplrspaceDefinitionReader {
  read(input: unknown): SmplrspaceDefinition {
    if (input == null) {
      throw new SmplrspaceDefinitionValidationError(
        'SmplrspaceDefinition is null or undefined; expected an object with a "levels" array.'
      );
    }

    if (typeof input !== 'object') {
      throw new SmplrspaceDefinitionValidationError(
        `SmplrspaceDefinition must be an object, received: ${typeof input}`
      );
    }

    if (!('levels' in input)) {
      throw new SmplrspaceDefinitionValidationError(
        'SmplrspaceDefinition is missing required property "levels".'
      );
    }

    const { levels } = input as { levels: unknown };

    if (!Array.isArray(levels)) {
      throw new SmplrspaceDefinitionValidationError(
        `SmplrspaceDefinition.levels must be an array, received: ${typeof levels}`
      );
    }

    return { levels } as SmplrspaceDefinition;
  }
}
