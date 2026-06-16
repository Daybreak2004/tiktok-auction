import React from 'react'

const LiveRoom: React.FC = () => {
  return (
    <div>
      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: 18 }}>直播间 - 视频播放区域</div>
      </div>
      <div style={{ padding: 16 }}>
        <h3>直播间</h3>
        <p>正在直播中...</p>
      </div>
    </div>
  )
}

export default LiveRoom
