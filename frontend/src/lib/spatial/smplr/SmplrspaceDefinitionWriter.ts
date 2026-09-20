import type { SmplrspaceDefinition } from './types/SmplrspaceDefinition';
import type { SmplrspaceLevel } from './types/SmplrspaceLevel';
import type { SmplrspaceWall, SmplrspaceWallOptions } from './types/SmplrspaceWall';
import type { SmplrspaceWallSegment } from './types/SmplrspaceWallSegment';
import type { SmplrspaceOpening } from './types/SmplrspaceOpening';
import type { SmplrspacePoint } from './types/SmplrspacePoint';

export interface AddLevelInput {
  readonly name: string;
  readonly roofs?: readonly unknown[];
}

export interface AddWallInput {
  readonly id: string;
  readonly name: string;
  readonly layers: readonly string[];
  readonly options?: SmplrspaceWallOptions;
}

export interface AddWallSegmentInput {
  readonly id: string;
  readonly start: SmplrspacePoint;
  readonly end: SmplrspacePoint;
}

/**
 * Builds an SmplrspaceDefinition incrementally, in memory only. Makes no
 * network calls, implements no GraphQL, and does not claim to persist
 * anything to Smplrspace -- see SmplrspaceClient for the (currently
 * unimplemented) future remote transport boundary.
 *
 * Every add* method replaces rather than mutates its target array, so
 * `getDefinition()` always returns the definition as it stood at the
 * moment of the call -- a snapshot that remains valid even if more
 * levels/walls/segments/openings are added afterwards.
 */
export class SmplrspaceDefinitionWriter {
  private definition: SmplrspaceDefinition = { levels: [] };

  createEmptyDefinition(): SmplrspaceDefinition {
    this.definition = { levels: [] };
    return this.definition;
  }

  addLevel(input: AddLevelInput): SmplrspaceDefinition {
    if (this.definition.levels.some((level) => level.name === input.name)) {
      throw new Error(`SmplrspaceDefinitionWriter: a level named "${input.name}" already exists.`);
    }

    const newLevel: SmplrspaceLevel = {
      name: input.name,
      roofs: input.roofs ?? [],
      walls: [],
    };

    this.definition = { levels: [...this.definition.levels, newLevel] };
    return this.definition;
  }

  addWall(levelName: string, input: AddWallInput): SmplrspaceDefinition {
    const level = this.findLevel(levelName);

    if (level.walls.some((wall) => wall.id === input.id)) {
      throw new Error(
        `SmplrspaceDefinitionWriter: wall "${input.id}" already exists on level "${levelName}".`
      );
    }

    const newWall: SmplrspaceWall = {
      id: input.id,
      name: input.name,
      type: 'wall',
      layers: input.layers,
      options: input.options,
      segments: [],
    };

    this.replaceLevel(levelName, { ...level, walls: [...level.walls, newWall] });
    return this.definition;
  }

  addWallSegment(
    levelName: string,
    wallId: string,
    input: AddWallSegmentInput
  ): SmplrspaceDefinition {
    const level = this.findLevel(levelName);
    const wall = this.findWall(level, wallId);

    if (wall.segments.some((segment) => segment.id === input.id)) {
      throw new Error(
        `SmplrspaceDefinitionWriter: segment "${input.id}" already exists on wall "${wallId}".`
      );
    }

    const newSegment: SmplrspaceWallSegment = {
      id: input.id,
      start: input.start,
      end: input.end,
      openings: [],
    };

    const updatedWall: SmplrspaceWall = { ...wall, segments: [...wall.segments, newSegment] };
    this.replaceLevel(levelName, { ...level, walls: this.replaceWall(level, updatedWall) });
    return this.definition;
  }

  addOpening(
    levelName: string,
    wallId: string,
    segmentId: string,
    opening: SmplrspaceOpening
  ): SmplrspaceDefinition {
    const level = this.findLevel(levelName);
    const wall = this.findWall(level, wallId);
    const segment = this.findSegment(wall, segmentId);

    if (segment.openings.some((existing) => existing.id === opening.id)) {
      throw new Error(
        `SmplrspaceDefinitionWriter: opening "${opening.id}" already exists on segment "${segmentId}".`
      );
    }

    const updatedSegment: SmplrspaceWallSegment = {
      ...segment,
      openings: [...segment.openings, opening],
    };
    const updatedWall: SmplrspaceWall = {
      ...wall,
      segments: wall.segments.map((existing) =>
        existing.id === segmentId ? updatedSegment : existing
      ),
    };
    this.replaceLevel(levelName, { ...level, walls: this.replaceWall(level, updatedWall) });
    return this.definition;
  }

  getDefinition(): SmplrspaceDefinition {
    return this.definition;
  }

  private findLevel(levelName: string): SmplrspaceLevel {
    const level = this.definition.levels.find((candidate) => candidate.name === levelName);
    if (!level) {
      throw new Error(`SmplrspaceDefinitionWriter: no level named "${levelName}" exists.`);
    }
    return level;
  }

  private findWall(level: SmplrspaceLevel, wallId: string): SmplrspaceWall {
    const wall = level.walls.find((candidate) => candidate.id === wallId);
    if (!wall) {
      throw new Error(
        `SmplrspaceDefinitionWriter: no wall "${wallId}" exists on level "${level.name}".`
      );
    }
    return wall;
  }

  private findSegment(wall: SmplrspaceWall, segmentId: string): SmplrspaceWallSegment {
    const segment = wall.segments.find((candidate) => candidate.id === segmentId);
    if (!segment) {
      throw new Error(
        `SmplrspaceDefinitionWriter: no segment "${segmentId}" exists on wall "${wall.id}".`
      );
    }
    return segment;
  }

  private replaceWall(
    level: SmplrspaceLevel,
    updatedWall: SmplrspaceWall
  ): readonly SmplrspaceWall[] {
    return level.walls.map((existing) => (existing.id === updatedWall.id ? updatedWall : existing));
  }

  private replaceLevel(levelName: string, updatedLevel: SmplrspaceLevel): void {
    this.definition = {
      levels: this.definition.levels.map((existing) =>
        existing.name === levelName ? updatedLevel : existing
      ),
    };
  }
}
