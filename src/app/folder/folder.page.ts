import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public pageName!: string;
  private activatedRoute = inject(ActivatedRoute);

  darkModeEnabled: boolean = false;


  constructor() {}

  ngOnInit() {
    this.pageName = this.activatedRoute.snapshot.paramMap.get('id') as string;
  } 

  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
  }
  
}
