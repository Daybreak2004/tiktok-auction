export interface ServerToClientEvents {
  price_update: (data: {
    productId: number
    currentPrice: number
    lastBidder: {
      id: number
      nickname: string
      avatar?: string
    }
  }) => void

  new_bid: (data: {
    id: number
    userId: number
    nickname: string
    avatar?: string
    price: number
    bidTime: string
  }) => void

  countdown: (data: {
    productId: number
    remainingSeconds: number
  }) => void

  auction_started: (data: {
    productId: number
    startTime: string
    durationSeconds: number
  }) => void

  auction_extended: (data: {
    productId: number
    extendedSeconds: number
    newRemainingSeconds: number
  }) => void

  auction_ended: (data: {
    productId: number
    finalPrice: number
    winnerUserId: number | null
  }) => void

  auction_cancelled: (data: {
    productId: number
  }) => void
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void
  leave_room: (roomId: string) => void
}
