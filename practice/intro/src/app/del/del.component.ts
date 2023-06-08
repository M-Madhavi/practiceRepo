import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-del',
  templateUrl: './del.component.html',
  styleUrls: ['./del.component.css']
})
export class DelComponent {
  @Input() delComp!:string;
  @Input() secdel!:string;
  @Input() thirdDel!:string;


}
