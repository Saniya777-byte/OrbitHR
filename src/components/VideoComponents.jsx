import React from 'react'
import myvideo from '../assets/MyVideo.mp4'

function VideoComponents() {
  return (
    <div>
        <video src={myvideo} autoPlay muted loop></video>
      
    </div>
  )
}

export default VideoComponents