import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-trainings',
  templateUrl: './home-trainings.page.html',
  styleUrls: ['./home-trainings.page.scss'],
})
export class HomeTrainingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('home Trainings loaded ')
  }

}
