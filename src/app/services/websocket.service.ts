import { Injectable } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Indique que le service est fourni à la racine de l'application
})
export class WebsocketService {
  private client: Client; // Client STOMP pour gérer les connexions WebSocket
  private messages: Subject<{ user: string, content: string }>; // Sujet pour émettre les messages reçus

  constructor() {
    // Initialisation du client STOMP
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/chat', // URL du broker WebSocket
      connectHeaders: {
        login: 'guest',
        passcode: 'guest'
      },
      debug: (str) => {
        console.log(str); // Fonction de débogage pour afficher les messages de débogage
      },
      reconnectDelay: 5000, // Délai de reconnexion en millisecondes
      heartbeatIncoming: 4000, // Intervalle de heartbeat entrant en millisecondes
      heartbeatOutgoing: 4000, // Intervalle de heartbeat sortant en millisecondes
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/chat'); // Fabrique de WebSocket utilisant SockJS
      }
    });

    // Gestion de la connexion réussie
    this.client.onConnect = (frame) => {
      console.log('Connected: ' + frame); // Affiche un message de connexion réussie
      // S'abonne au topic des messages
      this.client.subscribe('/topic/messages', (message: Message) => {
        this.messages.next(JSON.parse(message.body)); // Émet le message reçu
      });
    };

    // Gestion des erreurs STOMP
    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']); // Affiche l'erreur signalée par le broker
      console.error('Additional details: ' + frame.body); // Affiche les détails supplémentaires de l'erreur
    };

    this.client.activate(); // Active le client STOMP
    this.messages = new Subject<{ user: string, content: string }>(); // Initialise le sujet des messages
  }

  // Méthode pour envoyer un message
  sendMessage(message: { user: string, content: string }) {
    this.client.publish({
      destination: '/app/message', // Destination du message
      body: JSON.stringify(message) // Corps du message en format JSON
    });
  }

  // Méthode pour obtenir les messages en tant qu'Observable
  getMessages(): Observable<{ user: string, content: string }> {
    return this.messages.asObservable(); // Retourne les messages en tant qu'Observable
  }
}