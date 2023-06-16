import { useEffect } from "react"
import { useContext } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useCurrentFrame } from "remotion"
import { AESContext, KeyComponent, BlockComponent, Block } from "./AES.jsx"
import { mixColumns, shiftRows, subBytes, xor_list } from "./utils.js"
import { MySequence, VideoElement, inter } from "./Video.jsx"

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
    if (currentFrame === videoInformation[PART].duration - 1) setRound(0)
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

function SubBytesSequence() {
  const PART = 'sub-bytes'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound, b, setB} = useContext(AESContext)

  useEffect(() => setRound(0), [])
  useEffect(() => {
    if ((currentFrame - videoInformation[PART].start) === 15) {
      subBytes(b.getHex())
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


function ShiftRowsSequence() {
  const PART = 'shift-rows'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound, b, setB} = useContext(AESContext)

  useEffect(() => setRound(0), [])
  useEffect(() => {
    if ((currentFrame - videoInformation[PART].start) === 15) {
      shiftRows(b.getHex())
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

function MixColumnsSequence() {
  const PART = 'mix-columns'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound, b, setB} = useContext(AESContext)

  useEffect(() => setRound(0), [])
  useEffect(() => {
    if ((currentFrame - videoInformation[PART].start) === 15) {
      mixColumns(b.getHex())
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


function AddRoundKeySequence() {
  const PART = 'add-round-key'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound, b, setB} = useContext(AESContext)

  useEffect(() => {
    if ((currentFrame - videoInformation[PART].start) === 15) {
      xor_list(b.getHex(), expanded.slice(round * 16, (round + 1) * 16))
      setB((c) => new Block(c.getString()))
    }
    if ((currentFrame - videoInformation[PART].start) === 0) {
      setRound((r) => Math.min(r+1, 10))
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
      {videoInformation['sub-bytes'].show && <SubBytesSequence /> }
      {videoInformation['shift-rows'].show && <ShiftRowsSequence /> }
      {videoInformation['mix-columns'].show && <MixColumnsSequence /> }
      {videoInformation['add-round-key'].show && <AddRoundKeySequence /> }
    </ErrorBoundary>
    </>
  )
}