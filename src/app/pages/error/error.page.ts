import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {

  message: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.message = this.getMessageFromUrl();
  }

  getMessageFromUrl(){
    const message = this.activatedRoute.snapshot.paramMap.get('message');
    return message;
  }

  //Redirect to error if personalBestExercise's uid id not matching with current user's uid
  redirectToHomePage(){
    this.router.navigate(['/home']);
  }

}
