/**
 * Vendor-agnostic boundary: React components depend on this interface,
 * never on Smplrspace types directly (section 3/28 of the migration
 * spec). Deliberately minimal for now -- just enough to mount a viewer
 * and report its lifecycle. Picking, data layers, and QueryClient-backed
 * room/furniture discovery are geometry-dependent and come once a real
 * Space exists to build and test them against.
 */

export type SpatialEngineStatus = 'loading' | 'ready' | 'error';

export interface SpatialEngineHandle {
  status: SpatialEngineStatus;
  error: string | null;
  destroy: () => void;
}

export interface SpatialEngineConfig {
  spaceId: string;
  clientToken: string;
}

export interface SpatialEngine {
  mount(container: HTMLElement, config: SpatialEngineConfig): Promise<SpatialEngineHandle>;
}
