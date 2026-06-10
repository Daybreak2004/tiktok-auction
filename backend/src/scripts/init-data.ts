import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化测试数据...')

  const merchantPasswordHash = await bcrypt.hash('123456', 10)
  const userPasswordHash = await bcrypt.hash('123456', 10)

  const merchant = await prisma.merchant.upsert({
    where: { username: 'test_merchant' },
    update: {},
    create: {
      username: 'test_merchant',
      nickname: '测试商家',
      passwordHash: merchantPasswordHash
    }
  })

  console.log('测试商家账号创建成功: test_merchant / 123456')

  const user = await prisma.user.upsert({
    where: { username: 'test_user' },
    update: {},
    create: {
      username: 'test_user',
      nickname: '测试用户',
      passwordHash: userPasswordHash
    }
  })

  console.log('测试用户账号创建成功: test_user / 123456')

  console.log('测试数据初始化完成！')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
