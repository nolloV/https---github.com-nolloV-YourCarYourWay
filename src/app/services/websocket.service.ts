// websocket.service.ts
import { Injectable } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: CompatClient;
  private messages: Subject<{ user: string, content: string }>;

  constructor() {
    this.client = Stomp.over(new SockJS('http://localhost:8080/chat'));
    this.client.connect({}, () => {
      this.client.subscribe('/topic/messages', (message) => {
        this.messages.next(JSON.parse(message.body));
      });
    });
    this.messages = new Subject<{ user: string, content: string }>();
  }

  sendMessage(message: { user: string, content: string }) {
    this.client.send('/app/message', {}, JSON.stringify(message));
  }

  getMessages(): Observable<{ user: string, content: string }> {
    return this.messages.asObservable();
  }
}