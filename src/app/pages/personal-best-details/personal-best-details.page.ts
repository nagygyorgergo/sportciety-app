import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-personal-best-details',
  templateUrl: './personal-best-details.page.html',
  styleUrls: ['./personal-best-details.page.scss'],
})
export class PersonalBestDetailsPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log(this.getExerciseNameFromUrl());
  }

  getExerciseNameFromUrl(){
    const exerciseName = this.activatedRoute.snapshot.paramMap.get('exercise');
    return exerciseName;
  }

}
