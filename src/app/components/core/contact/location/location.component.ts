import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-location',
  template: `
    <a [href]="sanitizedGoogleMapsUrl" target="_blank">
    <img src="https://picsum.photos/500/500" class="flex justify-center rounded-xl " alt="">
    </a>
  `,
})
export class LocationComponent {
  public googleMapsLink: string = 'https://www.google.com/maps/place/29%C2%B058\'02.8%22N+30%C2%B054\'37.0%22E/@29.9674446,30.9124765,17z/data=!3m1!4b1!4m4!3m3!8m2!3d29.9674446!4d30.9102878?entry=ttu';

  constructor(private sanitizer: DomSanitizer) {}

  get sanitizedGoogleMapsUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.googleMapsLink);
  }
}

