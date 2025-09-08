import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule , // <-- contains routes referencing standalone components
  ],
   providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppModule {}
