import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Mensaje } from '../../interface/mensaje.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit  {

  mensaje: string =  "";
  element : any;

  constructor(public chatService:ChatService) { 
    chatService.cargarMensajes()
    
  }

  ngOnInit(){
    this.element = document.getElementById("app-mensajes")
  }
  ngAfterViewChecked() {
    this.element.scrollTop = this.element.scrollHeight 
  }

  sendMesage(){
    console.log(this.mensaje);
    
    if(this.mensaje.length === 0){
      return;
    }
    this.chatService.addMessage(this.mensaje)
    .then( ()=> this.mensaje = "")
    .catch( (err) => console.error('No se puedo enviar el mensaje', err))
    
  }
}
