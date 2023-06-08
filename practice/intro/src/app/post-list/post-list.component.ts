import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  @Input() postlistfromparent! : string;
  @Input() databindAttribute!:string;
  postlistMessageTobeShownInParentComponent ="this is the message from post list to the parent component"
  @Output() postListMessage = new EventEmitter<string>()

  fetchMessage(){
    this.postListMessage.emit(this.postlistMessageTobeShownInParentComponent)
    console.log("In Postlist component")
  }

}
