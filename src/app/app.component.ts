import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.addEventListener("dragover", (event: Event) => event.preventDefault(), false);
    window.addEventListener("drop", (event: Event) => event.preventDefault(), false);
  }
}
