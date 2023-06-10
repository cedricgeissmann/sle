import { useEffect } from "react"
import { useContext } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { interpolate, useCurrentFrame } from "remotion"
import { AESContext, KeyComponent, BlockComponent, Block } from "./AES.jsx"
import { xor_list } from "./utils.js"
import {MySequence, VideoElement} from "./Video.jsx"

function KeyExpansionSequence() {
  const PART = 'key-expansion'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound} = useContext(AESContext)

  useEffect(() => setRound(0), [])

  useEffect(() => {
    if (currentFrame === 0) setRound(0)
    if (currentFrame !== 0 
      && currentFrame % 5 === 0
      && currentFrame < videoInformation[PART].start + videoInformation[PART].duration ) {
      setRound(r => Math.min(r+1, 10))
    }
  }, [currentFrame])

  return (
      <MySequence 
        from={videoInformation[PART].start}
        durationInFrames={videoInformation[PART].duration}>
        <VideoElement>
          <KeyComponent expanded={expanded} round={round}>
          </KeyComponent>
        </VideoElement>
      </MySequence>
  )
}

function inter(frame, vidInfo, values) {
  return interpolate(
    frame,
    [vidInfo.start, vidInfo.start + vidInfo.duration],
    values)
}

function KeyTransitionSequence() {
  const PART = 'transition-key-expansion'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound} = useContext(AESContext)

  const transform = () => {
    const val = inter(currentFrame, videoInformation[PART], [0, -50])
    const shrink = inter(currentFrame, videoInformation[PART], [1, 0.7])
    return `translateX(${val}%) scale(${shrink})`
  }

  useEffect(() => setRound(10), [])

  return (
      <MySequence 
        from={videoInformation[PART].start}
        durationInFrames={videoInformation[PART].duration}>
        <VideoElement transform={transform}>
          <KeyComponent expanded={expanded} round={round}>
          </KeyComponent>
        </VideoElement>
      </MySequence>
  )
}

function BlockCreationSequence() {
  const PART = 'block-creation'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound, b} = useContext(AESContext)

  useEffect(() => setRound(10), [])

  const transform = () => {
    const scale = inter(currentFrame, videoInformation[PART], [0.5, 1.5])
    return `translateX(75%) scale(${scale})`
  }

  return (
      <MySequence 
        from={videoInformation[PART].start}
        durationInFrames={videoInformation[PART].duration}>
        <VideoElement transform="translateX(-50%) scale(0.7)">
          <KeyComponent expanded={expanded} round={round}>
          </KeyComponent>
        </VideoElement>

        <VideoElement transform={transform}>
          <BlockComponent b={b}>
          </BlockComponent>
        </VideoElement>
      </MySequence>
  )
}

function AddKeySequence() {
  const PART = 'add-initial-key'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound, b, setB} = useContext(AESContext)

  useEffect(() => setRound(0), [])
  useEffect(() => {
    if ((currentFrame - videoInformation[PART].start) === 15) {
      xor_list(b.getHex(), expanded.slice(round * 16, (round + 1) * 16))
      setB((c) => new Block(c.getString()))
    }
  }, [currentFrame])

  return (
      <MySequence 
        from={videoInformation[PART].start}
        durationInFrames={videoInformation[PART].duration}>
        <VideoElement transform="translateX(-50%) scale(0.7)">
          <KeyComponent expanded={expanded} round={round}>
          </KeyComponent>
        </VideoElement>

        <VideoElement transform='translateX(75%) scale(1.5)'>
          <BlockComponent b={b}>
          </BlockComponent>
        </VideoElement>
      </MySequence>
  )
}

export default function AESVideo() {
  const {videoInformation} = useContext(AESContext)
  return (
    <>
    <ErrorBoundary fallback={<div>Error in Video...</div>}>
      {Object.entries(videoInformation).filter(e => e.show) === 0 && <div>Nothing to show...</div>}
      {videoInformation['key-expansion'].show && <KeyExpansionSequence /> }
      {videoInformation['transition-key-expansion'].show && <KeyTransitionSequence /> }
      {videoInformation['block-creation'].show && <BlockCreationSequence /> }
      {videoInformation['add-initial-key'].show && <AddKeySequence /> }
    </ErrorBoundary>
    </>
  )
}