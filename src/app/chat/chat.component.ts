// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit {
  user: string = '';
  message: string = '';
  messages: { user: string, content: string }[] = [];

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    // S'abonner aux nouveaux messages
    this.websocketService.getMessages().subscribe((msg: { user: string, content: string }) => {
      this.messages.push(msg);
    });
  }

  sendMessage() {
    if (this.user && this.message) {
      this.websocketService.sendMessage({ user: this.user, content: this.message });
      this.message = '';
    }
  }
}