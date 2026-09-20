import { loadSmplrJs } from '@smplrspace/smplr-loader';
import type { Space } from '@smplrspace/smplr-loader';
import type { SpatialEngine, SpatialEngineConfig, SpatialEngineHandle } from '../SpatialEngine';

/** Real @smplrspace/smplr-loader API, confirmed against its published
 * .d.ts: loadSmplrJs(bundle?: 'esm' | 'umd', env?: 'prod'|'dev'|'local').
 * Default bundle is ESM (the loader's own default), matching Smplrspace's
 * guidance that UMD in their examples is a demo-environment workaround,
 * not the general recommendation. */
export class SmplrEngine implements SpatialEngine {
  async mount(container: HTMLElement, config: SpatialEngineConfig): Promise<SpatialEngineHandle> {
    let space: Space | undefined;
    try {
      const smplr = await loadSmplrJs();
      space = new smplr.Space({
        spaceId: config.spaceId,
        clientToken: config.clientToken,
        container,
      });

      await space.startViewer({
        mode: '3d',
        allowModeChange: true,
        hideNavigationButtons: false,
      });

      return {
        status: 'ready',
        error: null,
        destroy: () => space?.remove(),
      };
    } catch (error) {
      // A space that was constructed before the failure (e.g. startViewer
      // rejecting) still holds SDK listeners/DOM resources -- clean it up
      // here rather than leaking it via a no-op destroy.
      space?.remove();
      return {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        destroy: () => {},
      };
    }
  }
}
