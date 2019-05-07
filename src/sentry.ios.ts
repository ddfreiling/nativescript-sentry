/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./typings/sentry-api.ios.d.ts" />

import { BreadCrumb, ExceptionOptions, MessageOptions, SentryUser } from './';
import * as Raven from 'raven-js';

export class RavenClient {
  opts: any;
  _dsn: string;
  constructor(dsn, opts) {
    this._dsn = dsn;
    this.opts = {
      allowSecretKey: true,
      allowDuplicates: true,
      handlePromiseRejection: false,
      ...opts
    };
    Raven.config(dsn, this.opts);
    (<any>Raven).debug = true;
  }

  install() {
    Raven.install();
    // Raven.addPlugin(
    //   require('./raven-plugin'),
    //   {
    //     nativeClientAvailable: false,
    //     handlePromiseRejection: this.opts.handlePromiseRejection
    //   }
    // );
  }

  setDataCallback(callback) {
    Raven.setDataCallback(callback);
  }

  setShouldSendCallback(callback) {
    Raven.setShouldSendCallback(callback);
  }

  setUserContext(user) {
    Raven.setUserContext(user);
  }

  setTagsContext(tags) {
    Raven.setTagsContext(tags);
  }

  setExtraContext(extra) {
    Raven.setExtraContext(extra);
  }

  captureException(ex, options) {
    Raven.captureException(ex, options);
  }

  captureBreadcrumb(breadcrumb) {
    Raven.captureBreadcrumb(breadcrumb);
  }

  captureMessage(message, options) {
    Raven.captureMessage(message, options);
  }

  setRelease(release) {
    Raven.setRelease(release);
  }

  clearContext() {
    return Raven.clearContext();
  }

  context(options, func, args) {
    return Raven.context(options, func, args);
  }

  wrap(options, func) {
    return Raven.wrap(options, func);
  }
}

export class Sentry {
  static _ravenClient: RavenClient = null;
  public static init(dsn: string) {
    SentryClient.sharedClient = SentryClient.alloc().initWithDsnDidFailWithError(dsn);
    SentryClient.sharedClient.startCrashHandlerWithError();
    SentryClient.sharedClient.enableAutomaticBreadcrumbTracking();

    Sentry._ravenClient = new RavenClient(dsn, {});
    Sentry._ravenClient.install();
  }

  public static captureMessage(message: string, options?: MessageOptions) {
    const level = options && options.level ? options.level : null;

    const event = SentryEvent.alloc().initWithLevel(this._convertSentryLevel(level));
    event.message = message;

    if (options && options.extra) {
      event.extra = NSDictionary.dictionaryWithDictionary(options.extra as NSDictionary<string, any>);
    }

    if (options && options.tags) {
      event.tags = NSDictionary.dictionaryWithDictionary(options.tags as NSDictionary<string, string>);
    }
    SentryClient.sharedClient.sendEventWithCompletionHandler(event, () => {
      // nothing here
    });
  }

  public static captureException(exception: Error, options?: ExceptionOptions) {
    // const event = SentryEvent.alloc().initWithLevel(SentrySeverity.kSentrySeverityError);

    // // create a string of the entire Error for sentry to display as much info as possible
    // event.message = JSON.stringify({
    //   message: exception.message,
    //   // stacktrace: exception.stack,
    //   name: exception.name
    // });

    // if (options && options.extra) {
    //   event.extra = NSDictionary.dictionaryWithDictionary(options.extra as NSDictionary<string, any>);
    // }

    // if (options && options.tags) {
    //   event.tags = NSDictionary.dictionaryWithDictionary(options.tags as NSDictionary<string, string>);
    // }

    Sentry._ravenClient.captureException(exception, options);
  }

  public static captureBreadcrumb(breadcrumb: BreadCrumb) {
    // create the iOS SentryBreadCrumb
    const sentryBC = SentryBreadcrumb.alloc().initWithLevelCategory(
      this._convertSentryLevel(breadcrumb.level),
      breadcrumb.category
    );
    sentryBC.message = breadcrumb.message;
    SentryClient.sharedClient.breadcrumbs.addBreadcrumb(sentryBC);
  }

  public static setContextUser(user: SentryUser) {
    const userNative = SentryUser.alloc().initWithUserId(user.id);
    userNative.email = user.email ? user.email : '';
    userNative.username = user.username ? user.username : '';
    if (user.data) {
      // create NSDictionary<string, any> for the object provided
      const dict = NSDictionary.dictionaryWithDictionary(user.data as NSDictionary<string, any>);
      userNative.extra = dict ? dict : null;
    }
    SentryClient.sharedClient.user = userNative;
  }

  public static setContextTags(tags: any) {
    SentryClient.sharedClient.tags = NSDictionary.dictionaryWithDictionary(tags as NSDictionary<string, string>);
  }
  public static setContextExtra(extra: any) {
    SentryClient.sharedClient.extra = NSDictionary.dictionaryWithDictionary(extra as NSDictionary<string, any>);
  }

  public static clearContext() {
    SentryClient.sharedClient.clearContext();
  }

  /**
   * Returns the ios Sentry Level for the provided TNS_SentryLevel
   * @default - INFO
   */
  private static _convertSentryLevel(level: Level) {
    if (!level) {
      return SentrySeverity.kSentrySeverityInfo;
    }

    switch (level) {
      case Level.Info:
        return SentrySeverity.kSentrySeverityInfo;
      case Level.Warning:
        return SentrySeverity.kSentrySeverityWarning;
      case Level.Fatal:
        return SentrySeverity.kSentrySeverityFatal;
      case Level.Error:
        return SentrySeverity.kSentrySeverityError;
      case Level.Debug:
        return SentrySeverity.kSentrySeverityDebug;
      default:
        return SentrySeverity.kSentrySeverityInfo;
    }
  }
}

export enum Level {
  Fatal = 'fatal',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug'
}
