import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { AccountService } from './account-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private http = inject(HttpClient);
  private accountservice = inject(AccountService);
  private hubConnection?: HubConnection;
  messageThread = signal<Message[]>([]);

  createHubConnections(otherUserId: string) {
    const currentUser = this.accountservice.currentUser();
    if(!currentUser) return;
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl +'messages?userId='+otherUserId,{
      accessTokenFactory:()=>currentUser.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch(error=>console.log(error));
    
    this.hubConnection.on("ReceiveMessageThread",(messages:Message[])=>{
      this.messageThread.set(messages.map(message => ({
          ...message,
          currentUserSender: message.senderId !== otherUserId
        })))
    })

     this.hubConnection.on("NewMessage",(message:Message)=>{
   
          message.currentUserSender= message.senderId === currentUser.id;
          this.messageThread.update(messages=>[...messages,message])
        
    })

    
  }

  stopHubConnections(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().catch(e=>console.log(e));
    }
  }

  getMessages(container: string, pageNumber: number, pageSize: number) {

    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('container', container);

    return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'messages', { params });

  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + memberId);
  }

  sendMessage(recipientId: string, content: string) {
    return this.hubConnection?.invoke( 'SendMessage', { recipientId, content })
  }

  deleteMessage(id: string) {
    return this.http.delete(this.baseUrl + "messages/" + id);
  }

  // deleteMessage(id: string) {
  //   this.messageService.deleteMessage(id).subscribe({
  //     next: () => {
  //       const current = this.paginatedMessages();
  //       if (current?.items) {
  //         this.paginatedMessages.update((prev) => {
  //           if (!prev) return null;
  //           const newItems = prev.items?.filter(x => x.id !== id) || [];
  //           const newMetadata = prev.metadata ? {
  //             ...prev.metadata,
  //             totalCount: prev.metadata.totalCount - 1,
  //             totalPages: Math.max(1, Math.ceil((prev.metadata.totalCount - 1) /
  //               prev.metadata.pageSize)),
  //             currentPage: Math.min(
  //               prev.metadata.currentPage,
  //               Math.max(1, Math.ceil((prev.metadata.totalCount - 1) /
  //                 prev.metadata.pageSize))
  //             )
  //           } : undefined;
  //           return {
  //             items: newItems,
  //             metadata: newMetadata
  //           };
  //         });
  //       }
  //     }
  //   });
  // }



}
