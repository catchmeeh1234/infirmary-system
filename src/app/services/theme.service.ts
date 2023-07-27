import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  private currentThemeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('default');

  public currentTheme$ = this.currentThemeSubject.asObservable();

  public setTheme(themeName: string): void {
    this.currentThemeSubject.next(themeName);
  }
}
