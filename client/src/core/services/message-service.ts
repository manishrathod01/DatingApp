import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

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
    return this.http.post<Message>(this.baseUrl + 'messages', { recipientId, content })
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
