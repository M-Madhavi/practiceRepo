import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  title: string = 'List of Posts';

  messagePost: string = 'MessagePosts';

  postlistmessage = 'message from post component';

  childMessage = 'message fom Child';
  childmessageusingoutput = 'child message using output decorator';

  @Input() fromParent!: string;

  @Output() messageEvent = new EventEmitter<string>();//same name(messageEvent) in app component html

  sendMessage(){
    console.log("CCCCCCCCClicked")
    this.messageEvent.emit(this.childmessageusingoutput)
  }
}
