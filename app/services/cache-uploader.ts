import { Service } from './service';
import { UserService } from './user';
import { Inject } from '../util/injector';
import electron from 'electron';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { compact } from 'lodash';
import archiver from 'archiver';
import AWS from 'aws-sdk';

export class CacheUploaderService extends Service {
  @Inject()
  userService: UserService;

  get cacheDir() {
    return electron.remote.app.getPath('userData');
  }

  uploadCache(): Promise<string> {
    return new Promise(resolve => {
      const cacheDir = this.cacheDir;
      const dateStr = new Date().toISOString();
      const username = this.userService.username;
      const keyname = `${compact([dateStr, username]).join('-')}.zip`;
      const cacheFile = path.join(os.tmpdir(), 'slobs-cache.zip');
      const output = fs.createWriteStream(cacheFile);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        const file = fs.createReadStream(cacheFile);

        AWS.config.region = 'us-west-2';

        // This is a restricted cache upload account
        AWS.config.credentials = new AWS.Credentials({
          accessKeyId: 'AKIAIAINC32O7I3KUJGQ',
          secretAccessKey: '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',
        });

        const upload = new AWS.S3.ManagedUpload({
          params: {
            Bucket: 'streamlabs-obs-user-cache',
            Key: keyname,
            Body: file,
          },
        });

        upload.promise().then(() => {
          resolve(keyname);
        });
      });

      archive.pipe(output);
      this.addDirIfExists(archive, 'node-obs');
      this.addDirIfExists(archive, 'SceneConfigs');
      this.addDirIfExists(archive, 'SceneCollections');
      this.addDirIfExists(archive, 'Streamlabels');
      this.addFileIfExists(archive, 'log.log');
      archive.file(path.join(cacheDir, 'basic.ini'), { name: 'basic.ini' });
      archive.file(path.join(cacheDir, 'global.ini'), { name: 'global.ini' });
      archive.file(path.join(cacheDir, 'service.json'), { name: 'service.json' });
      archive.file(path.join(cacheDir, 'streamEncoder.json'), { name: 'streamEncoder.json' });
      archive.file(path.join(cacheDir, 'recordEncoder.json'), { name: 'recordEncoder.json' });
      archive.file(path.join(cacheDir, 'window-state.json'), { name: 'window-state.json' });
      archive.finalize();
    });
  }

  private addDirIfExists(archive: archiver.Archiver, name: string) {
    const dirPath = path.join(this.cacheDir, name);

    if (fs.existsSync(dirPath)) {
      archive.directory(dirPath, name);
    }
  }

  private addFileIfExists(archive: archiver.Archiver, name: string) {
    const dirPath = path.join(this.cacheDir, name);

    if (fs.existsSync(dirPath)) {
      archive.file(dirPath, { name });
    }
  }
}
