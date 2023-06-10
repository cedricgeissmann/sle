import { Sequence, AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion'
import { useEffect } from 'react'

export function VideoTransform({from, to}) {
  const frame = useCurrentFrame()
  const {durationInFrames} = useVideoConfig()
  const opacityFrom = interpolate(frame, [0, durationInFrames], [1, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})
  const opacityTo = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp'})

  return (
    <>
      <div style={{position: 'relative', fontSize: '7rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{position: 'absolute', opacity: opacityFrom}}>{from}</div>
        <div style={{position: 'absolute', opacity: opacityTo}}>{to}</div>
      </div>
    </>
  )
}

export function VideoElement({children, top, left, right, bottom}) {
  return (
      <div style={{
        position: 'absolute',
        color: 'white',
        top: typeof top === 'function' ? top() : top,
        left: typeof left === 'function' ? left() : left,
        right: typeof right === 'function' ? right() : right,
        bottom: typeof bottom === 'function' ? bottom() : bottom,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {children}
      </div>
  )
}


export function MySequence({children, from, durationInFrames}) {

  useEffect(() => {
    console.log(from, durationInFrames)
  }, [])
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        {children}
      </AbsoluteFill>
    </Sequence>
  )
}

export function VideoChapterContainer({chapters, video, playbackRate, setPlaybackRate}) {

  function faster() {
    setPlaybackRate((cur) => Math.min(cur * 2, 4))
  }
  function slower() {
    setPlaybackRate((cur) => Math.max(cur / 2, 0.125))
  }

  return (
    <div className='vid-container'>
      <div className='video-controls'>
        <button onClick={() => slower()}>Slower</button>
        <span>Speed: {playbackRate}</span>
        <button onClick={() => faster()}>Faster</button>
      </div>
    <div className="video-chapter">
      <ul>
        {chapters}
      </ul>
      <div>{video}</div>
    </div>
    </div>
  )
}

export function VideoChapterLink({info, setInfo, playerRef, part, children}) {
  function jumpToPart() {
    playerRef.current && playerRef.current.seekTo(info[part].start)
  }

  function togglePart() {
    setInfo((old) => {
      const inf = {...old}
      inf[part].show = !old[part].show
      return inf
    })
  }

  return <li onClick={() => jumpToPart()}>
    <span>
      {children}
    </span>
    <label htmlFor={`display-${part}`}>
      <input type="checkbox" id={`display-${part}`} defaultChecked={true} onChange={() => togglePart()} />
    </label>
    </li>
}