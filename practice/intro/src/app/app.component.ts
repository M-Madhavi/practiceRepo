import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PostComponent } from './post/post.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'intro';
  parentmessageName: string = 'message changed';
  postListMessagefromParent: string = 'postlist message from parent';
  delcompvalue = 'Delete this';
  secDelstatment = 'second delte sentence';
  thirddelStatement = 'third Delete statement';

  mesgFromChild: string = '';
  bool: boolean = true;
  @ViewChild(PostComponent) childcompmessage: any;
  constructor() {
    console.log('childcompmessage', this.childcompmessage);
  }
  ngAfterViewInit(): void {
    console.log('childcompmessage@@@@@@@@@@@@@@@', this.childcompmessage);
    this.mesgFromChild = this.childcompmessage.childMessage;
    console.log('e@@@@@@@@@@@@@@@', this.mesgFromChild);
  }

  receiveMessage($event: any) {
    console.log('eventrttttttttttttttttttttt', $event);
  }
  postListMessage($event: any) {
    console.log(
      'postListMessagepostListMessagepostListMessagepostListMessage',
      $event
    );
  }

  buttonclik(val:any){
    console.log("Button click",val)
  }

  // keyupfun(event:any){
    keyupfun(){

    console.log("Key UUUUUp")

  }

  keyupfunc(event:any){

    console.log("Key UUUUUp",event.target.value,event.target)

  }
  keyfunc(val:any){
    console.log("Heyyyyyy",val)

  }
}
