import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface'

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private angularFirestore: AngularFirestore,
    public auth: AngularFireAuth) {
      this.auth.authState.subscribe(user => {
        console.log('Estado del usuario', user);
        if(!user){
          return
        }
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
        
      })
  }


  login(proveedor: string) {
    if(proveedor === 'google'){
      this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }else{
      this.auth.signInWithPopup(new auth.GithubAuthProvider());
    }
  }
  logout(proveedor: string) {
    this.usuario = {};
    this.auth.signOut();
  }

  cargarMensajes() {
    {
      this.itemsCollection = this.angularFirestore.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));

      return this.itemsCollection.valueChanges().forEach((mensajes: Mensaje[]) => {
        console.log(mensajes);

        this.chats = [];
        for (let mensaje of mensajes) {
          this.chats.unshift(mensaje)
        }
        // this.chats = mensajes
        return this.chats

      })

    }
  }

  addMessage(texto: string) {
    // Falta el uid del usuario
    let message: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }
    return this.itemsCollection.add(message)
  }



}
