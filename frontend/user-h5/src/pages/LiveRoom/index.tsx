import React from 'react'
import { Card, Video, Button } from 'antd-mobile'

const LiveRoom: React.FC = () => {
  return (
    <div>
      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
        <Video
          src=""
          poster="https://via.placeholder.com/800x450"
          controls
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <h3>直播间</h3>
        <p>正在直播中...</p>
      </div>
    </div>
  )
}

export default LiveRoom
