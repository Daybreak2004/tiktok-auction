import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { INestApplicationContext } from '@nestjs/common'

export class AuthenticatedSocketIoAdapter extends IoAdapter {
  private jwtService: JwtService

  constructor(app: INestApplicationContext) {
    super(app)
    this.jwtService = app.get(JwtService)
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options)

    server.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token

      if (!token) {
        return next(new Error('Unauthorized: No token provided'))
      }

      try {
        const payload = this.jwtService.verify(token)
        socket.user = payload
        next()
      } catch (error) {
        next(new Error('Unauthorized: Invalid token'))
      }
    })

    return server
  }
}
