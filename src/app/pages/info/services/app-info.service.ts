import { Injectable, signal } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AppInfoService {
  readonly appStage = signal(environment.appStage);

  async getAppVersion(): Promise<string> {
    if (this.isNativePlatform()) {
      try {
        return await this.readNativeAppVersion();
      } catch {
        return environment.appVersion;
      }
    }

    return environment.appVersion;
  }

  private isNativePlatform(): boolean {
    return Capacitor.getPlatform() !== 'web';
  }

  private async readNativeAppVersion(): Promise<string> {
    const info = await App.getInfo();
    return info.version;
  }
}
