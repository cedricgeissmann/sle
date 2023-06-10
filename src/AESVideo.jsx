import { useEffect } from "react"
import { useContext } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useCurrentFrame } from "remotion"
import { AESContext, KeyComponent } from "./AES.jsx"
import {MySequence, VideoElement} from "./Video.jsx"

function KeyExpansionSequence() {
  const PART = 'key-expansion'
  const currentFrame = useCurrentFrame()
  const {videoInformation, expanded, round, setRound} = useContext(AESContext)

  useEffect(() => {
    if (currentFrame === 0) setRound(0)
    if (currentFrame !== 0 && currentFrame % 5 === 0) {
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

export default function AESVideo() {
  const {videoInformation} = useContext(AESContext)
  return (
    <>
    <ErrorBoundary fallback={<div>Error in Video...</div>}>
      {Object.entries(videoInformation).filter(e => e.show) === 0 && <div>Nothing to show...</div>}
      {videoInformation['key-expansion'].show && <KeyExpansionSequence /> }
      {videoInformation['add-initial-key'].show && <div>Not yet implemented...</div> }
    </ErrorBoundary>
    </>
  )
}