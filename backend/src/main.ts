import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { AuthenticatedSocketIoAdapter } from './modules/websocket/adapters/socket-io.adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: '*',
    credentials: true
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  app.useGlobalFilters(new AllExceptionsFilter())

  app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app))

  const port = process.env.PORT || 3000
  await app.listen(port)

  console.log(`🚀 直播竞拍后端服务已启动: http://localhost:${port}`)
  console.log(`🔌 WebSocket 服务已就绪`)
}

bootstrap()
