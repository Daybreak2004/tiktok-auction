import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { ServerToClientEvents, ClientToServerEvents } from './types/socket-events'

@WebSocketGateway<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: '*'
  }
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>

  private readonly logger = new Logger(WebsocketGateway.name)

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}, user: ${(client as any).user?.sub}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId)
    this.logger.log(`Client ${client.id} joined room ${roomId}`)
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.leave(roomId)
    this.logger.log(`Client ${client.id} left room ${roomId}`)
  }

  broadcastToRoom(roomId: string, event: keyof ServerToClientEvents, data: any) {
    this.server.to(roomId).emit(event as any, data)
  }
}
