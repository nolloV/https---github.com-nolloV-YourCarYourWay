// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-chat', // Sélecteur du composant
  standalone: true, // Indique que le composant est autonome
  templateUrl: './chat.component.html', // Chemin vers le template HTML du composant
  styleUrls: ['./chat.component.scss'], // Chemin vers les styles CSS du composant
  imports: [CommonModule, FormsModule] // Modules importés pour le composant
})
export class ChatComponent implements OnInit {
  user: string = ''; // Nom de l'utilisateur
  message: string = ''; // Contenu du message
  messages: { user: string, content: string }[] = []; // Liste des messages

  // Injection du service WebsocketService
  constructor(private websocketService: WebsocketService) { }

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {
    // S'abonner aux nouveaux messages
    this.websocketService.getMessages().subscribe((msg: { user: string, content: string }) => {
      this.messages.push(msg); // Ajouter le message à la liste des messages
    });
  }

  // Méthode pour envoyer un message
  sendMessage() {
    if (this.user && this.message) { // Vérifie que l'utilisateur et le message ne sont pas vides
      this.websocketService.sendMessage({ user: this.user, content: this.message }); // Envoie le message via le service WebSocket
      this.message = ''; // Réinitialise le champ de saisie du message
    }
  }
}