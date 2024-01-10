import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-liker-popover',
  template: `
    <ion-list>
      <ion-item *ngFor="let likerUid of likerUids">
        {{ likerUid }}
      </ion-item>
    </ion-list>
  `,
  styleUrls: ['./liker-popover.component.scss'],
})
export class LikerPopoverComponent {

  @Input() likerUids!: string[];
}
