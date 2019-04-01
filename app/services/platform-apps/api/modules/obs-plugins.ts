import { Module, EApiPermissions, apiMethod, IApiContext } from './module';
import { ObsUserPluginsService } from 'services/obs-user-plugins';
import { Inject } from 'util/injector';

export class ObsPluginsModule extends Module {
  readonly moduleName = 'ObsPlugins';
  readonly permissions: EApiPermissions[] = [];

  @Inject() obsUserPluginsService: ObsUserPluginsService;

  @apiMethod()
  async initializeModule(ctx: IApiContext, dllFile: string) {
    await this.obsUserPluginsService.initializeModule(dllFile);
  }
}
