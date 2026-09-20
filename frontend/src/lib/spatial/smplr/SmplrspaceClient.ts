/**
 * Configuration for a future remote Smplrspace transport. Phase 1 only
 * defines this boundary -- SmplrspaceClient performs no network calls,
 * and no endpoints (documented or otherwise) are implemented here.
 */
export interface SmplrspaceClientConfig {
  /**
   * Corresponds to Smplrspace's own project concept (see
   * `QueryClient.createSpace`'s documented `addToProjectId` option) --
   * not invented here. Optional because no real Smplrspace project
   * exists yet; requiring it here would force a caller to fabricate a
   * value just to construct this config, unlike `organizationId` and
   * `spaceId`, which this boundary can't meaningfully do without.
   */
  readonly projectId?: string;
  readonly organizationId: string;
  readonly spaceId: string;
  /**
   * The Smplrspace *client* token used by the public viewer SDK
   * (`loadSmplrJs`, `Space`) -- a client-side-safe, publicly embeddable
   * credential, distinct from any private/authenticated API credential
   * a future server-side integration (e.g. QueryClient-backed space
   * creation or mutation) would require. That private credential is not
   * modelled here and must never be conflated with this token.
   */
  readonly clientToken: string;
}

/**
 * Boundary for future remote Smplrspace operations. Phase 1 stores
 * configuration only; it makes no network calls and implements no
 * read/write operations, documented or otherwise. Concrete operations
 * are added once they correspond to a documented Smplrspace API.
 */
export class SmplrspaceClient {
  constructor(private readonly config: SmplrspaceClientConfig) {}

  getConfig(): SmplrspaceClientConfig {
    return this.config;
  }
}
