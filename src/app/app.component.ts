import { Component, ElementRef, HostBinding, OnInit, Renderer2 } from '@angular/core';
import {TranslateService} from '@ngx-translate/core'
import "flowbite"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
//#region  params
isTranslated:boolean=false
//#endregion

  //#region  dark

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
  @HostBinding('class.dark') get mode() {
    return this.darkMode;
  }
  //#endregion
  
  //#region  translate
  constructor(private TranslateService:TranslateService ,private renderer: Renderer2, private el: ElementRef){
//#region  translate 

this.TranslateService.setDefaultLang('en'); // Set your default language
this.TranslateService.use('en'); // Set the initial language to use
this.TranslateService.onLangChange.subscribe(() => {
  // Set isTranslated to true when translated content is displayed
  this.isTranslated = true;
});
//#endregion
  

}
  ngOnInit() {
    // Load translations when the component initializes
    this.loadTranslations();
  }
  loadTranslations() {
    // Here you can load translations using the translate service.
    // For example, if you have translation files, you can load them like this:
    this.TranslateService.get('key').subscribe((res: string) => {
      console.log(res)
    });
  }
  translate(event:any){
    this.TranslateService.use(event.target.value)
  }
  //#endregion
}
