export type Message ={
  id: string
  senderId: string
  senderDisplayName: string
  senderImageUrl: string
  recepientId: string
  recepientDisplayName: string
  recepientImageUrl: string
  content: string
  dateRead?: string
  messageSent: string
  currentUserSender?:boolean
}