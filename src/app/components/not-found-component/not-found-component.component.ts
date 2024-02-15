import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: `<!-- You can add a simple message or spinner here -->`,
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const message = "Page not found";
    // Navigate to the error page with a custom message
    this.router.navigate(['/error', message]);
  }

}
