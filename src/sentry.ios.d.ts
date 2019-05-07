/// <reference path="typings/sentry-api.ios.d.ts" />
import { BreadCrumb, ExceptionOptions, MessageOptions, SentryUser } from './';
import * as Raven from 'raven-js';
export declare class RavenClient {
  opts: any;
  _dsn: string;
  constructor(dsn: any, opts: any);
  install(): void;
  setDataCallback(callback: any): void;
  setShouldSendCallback(callback: any): void;
  setUserContext(user: any): void;
  setTagsContext(tags: any): void;
  setExtraContext(extra: any): void;
  captureException(ex: any, options: any): void;
  captureBreadcrumb(breadcrumb: any): void;
  captureMessage(message: any, options: any): void;
  setRelease(release: any): void;
  clearContext(): Raven.RavenStatic;
  context(options: any, func: any, args: any): void;
  wrap(options: any, func: any): Function;
}
export declare class Sentry {
  static _ravenClient: RavenClient;
  static init(dsn: string): void;
  static captureMessage(message: string, options?: MessageOptions): void;
  static captureException(exception: Error, options?: ExceptionOptions): void;
  static captureBreadcrumb(breadcrumb: BreadCrumb): void;
  static setContextUser(user: SentryUser): void;
  static setContextTags(tags: any): void;
  static setContextExtra(extra: any): void;
  static clearContext(): void;
  private static _convertSentryLevel;
}
export declare enum Level {
  Fatal = 'fatal',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug'
}
