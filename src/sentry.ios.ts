import { Common } from './sentry.common';
import * as application from 'tns-core-modules/application';
import { SentryAppDelegate } from './sentry.appdelegate';

declare var SentryClient, SentrySeverity, SentryEvent : any;

export class Sentry extends Common {
    public static init(dsn: string) {

        try {
            if(application.ios){
                SentryClient.sharedClient = SentryClient.alloc().initWithDsnDidFailWithError(dsn);
                application.ios.delegate = SentryAppDelegate;
            }

        } catch(error){
            
            console.log('[Sentry - iOS] Exeption on init: ', error);
        }
    }

    
    public static capture(error: any) {
        try {
            let event = new SentryEvent({ level: SentrySeverity.Error }); //if this fails try SentryEvent.alloc()
            event.message = error;
            
            SentryClient.sharedClient.sendEventWithCompletionHandler(event, (error) => {
                if (error) {
                    console.log('[Sentry - iOS] Exeption on capture: ', error);
                }
            });

        } catch (sentryError) {
            console.log('[Sentry - iOS] ORIGINAL ERROR:', error);
            console.log('[Sentry - iOS] Exeption on capture: ', sentryError);
        }
    }
}
