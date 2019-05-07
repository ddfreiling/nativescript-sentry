import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { SentryModule } from "nativescript-sentry/angular";
import { AppComponent } from "./app.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptCommonModule,
    SentryModule.forRoot({
      dsn: "https://aedd5457c1194e2c8ec31c8e6453ea4c@sentry.io/1424834"
    })
  ],
  declarations: [AppComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
