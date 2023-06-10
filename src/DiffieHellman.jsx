import { useEffect, useState, createContext, useContext } from 'react'
import { Player } from '@remotion/player'
import './Vigenere.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps, Video } from 'remotion'
import { LetterList, Letter, ShiftingLetter } from './LetterList'
import { keyToAlphabet, shiftChar} from './utils'
import { VideoElement, VideoTransform, MySequence, VideoChapterContainer, VideoChapterLink, calcVideoDuration, inter } from './Video'
import { useRef } from 'react'

const DHContext = createContext(null)

function diffie(base, exp, mod) {
  return (base ** exp) % mod
}

function IntroSequence() {
  const PART = 'intro'
  const frame = useCurrentFrame()
  const {videoInformation} = useContext(DHContext)

  function transform() {
    const grow = inter(frame, videoInformation[PART], [1, 2])
    return `scale(${grow})`
  }

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement left='20%' top="10%" transform={transform}>
        <h2>Alice</h2>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={transform}>
        <h2>Bob</h2>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
      </VideoElement>
    </MySequence>
  )
}

function PublicInitSequence() {
  const PART = 'init-public'
  const frame = useCurrentFrame()
  const {g, n, videoInformation} = useContext(DHContext)

  function opacity() {
    const opacity = inter(frame, videoInformation[PART], [0, 1])
    return `${opacity}`
  }

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement left='20%' top="10%" transform={"scale(2)"}>
        <h2>Alice</h2>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={"scale(2)"}>
        <h2>Bob</h2>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
        <VideoElement top="100px" transparency={opacity}>
          <div style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: "1rem"
          }}>
            <span> g={g}; </span>
            <span> n={n} </span>
          </div>
        </VideoElement>
      </VideoElement>
    </MySequence>
  )
}

function PrivateInitSequence() {
  const PART = 'init-private'
  const frame = useCurrentFrame()
  const {g, n, a, b, videoInformation} = useContext(DHContext)

  function opacity() {
    const opacity = inter(frame, videoInformation[PART], [0, 1])
    return `scale(${opacity})`
  }

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement left='20%' top="10%" transform={"scale(2)"}>
        <h2>Alice</h2>
        <VideoElement top="100px" transform={opacity}>
          a={a}
        </VideoElement>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={"scale(2)"}>
        <h2>Bob</h2>
        <VideoElement top="100px" transform={opacity}>
          b={b}
        </VideoElement>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
        <VideoElement top="100px" opacity={1}>
          <div style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: "1rem"
          }}>
            <span> g={g}; </span>
            <span> n={n} </span>
          </div>
        </VideoElement>
      </VideoElement>
    </MySequence>
  )
}

function CalcExchangeKeySequence() {
  const PART = 'calc-exchange-key'
  const frame = useCurrentFrame()
  const {g, n, a, b, videoInformation} = useContext(DHContext)

  function opacity() {
    const opacity = inter(frame, videoInformation[PART], [0, 1])
    return `scale(${opacity})`
  }

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement left='20%' top="10%" transform={"scale(2)"}>
        <h2>Alice</h2>
        <VideoElement top="100px">
          <VideoTransform from={"g^a % n"} to={`${g}^${a} % ${n}`} />
        </VideoElement>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={"scale(2)"}>
        <h2>Bob</h2>
        <VideoElement top="100px">
          <VideoTransform from={"g^a % n"} to={`${g}^${b} % ${n}`} />
        </VideoElement>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
        <VideoElement top="100px" opacity={1}>
          <div style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: "1rem"
          }}>
            <span> g={g}; </span>
            <span> n={n} </span>
          </div>
        </VideoElement>
      </VideoElement>
    </MySequence>
  )
}

function RestSequence() {
  const PART = 'key-exchange'
  const frame = useCurrentFrame()
  const {a, b, n, g, A, B, kAlice, kBob, videoInformation} = useContext(DHContext)

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement top={120} left="200px">
        <h2>Alice</h2>
        <VideoElement top={100}>
          <span>a={a}</span>
        </VideoElement>
        <VideoElement top={180}>
          <span>
            <VideoElement
              left={() => interpolate(frame, [30, 60], [0, 800], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})}
              top={() => interpolate(frame, [30, 60], [0, 100], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})}
            >
              <VideoTransform
                style={{
                  opacity: interpolate(frame, [0, 60], [0, 1], {extrapolateRight: "clamp", extrapolateLeft: "clamp"}),
                }}
                from="A"
                to={A}
              />
            </VideoElement>
          </span>
          <span>=g^a mod n</span>
        </VideoElement>
        <VideoElement
          top={interpolate(frame, [60, 120], [260, 460], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})}
          left={() => interpolate(frame, [60, 120], [0, 350], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})}
        >
          <span>
            <VideoTransform from="K" to={kAlice} />
          </span>
          <span
            style={{
              opacity: interpolate(frame, [60, 90], [1, 0], {extrapolateRight: "clamp", extrapolateLeft: "clamp"}),
            }}
          >
            B^a mod n
          </span>
        </VideoElement>
      </VideoElement>
      <VideoElement top={120}>
        <h2>Public</h2>
        <VideoElement top={100}>
          <div
            style={{
              gap: "1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "100%",
              borderBottom: "1px solid white",
            }}
          >
            <span>g={g}</span>
            <span>n={n}</span>
          </div>
        </VideoElement>
      </VideoElement>
      <VideoElement top={120} right="200px">
        <h2>Bob</h2>
        <VideoElement top={100}>
          <span>b={b}</span>
        </VideoElement>
        <VideoElement top={180}>
          <span>
            <VideoElement
              right={() =>
                interpolate(frame, [30, 60], [0, 800], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})
              }
              top={() => interpolate(frame, [30, 60], [0, 100], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})}
            >
              <VideoTransform from="B" to={B} />
            </VideoElement>
          </span>
          <span>=g^b mod n</span>
        </VideoElement>
        <VideoElement
          top={interpolate(frame, [60, 120], [260, 460], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})}
          right={interpolate(frame, [60, 120], [0, 350], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})}
        >
          <span>
            <VideoTransform from="K" to={kBob} />
          </span>
          <span
            style={{
              opacity: interpolate(frame, [60, 90], [1, 0], {extrapolateRight: "clamp", extrapolateLeft: "clamp"}),
            }}
          >
            =A^b mod n
          </span>
        </VideoElement>
      </VideoElement>
    </MySequence>
  )
}

function DHVideo() {
  const frame = useCurrentFrame()
  const {a, b, n, g, A, B, kAlice, kBob, videoInformation} = useContext(DHContext)

  return <>
    {videoInformation["intro"].show && <IntroSequence />}
    {videoInformation["init-public"].show && <PublicInitSequence />}
    {videoInformation["init-private"].show && <PrivateInitSequence />}
    {videoInformation["calc-exchange-key"].show && <CalcExchangeKeySequence />}
    {videoInformation["key-exchange"].show && <RestSequence />}
    </>
}

function DiffieHellman() {
  const [a, setA] = useState(5)
  const [b, setB] = useState(11)
  const [n, setN] = useState(13)
  const [g, setG] = useState(7)
  const [A, setAA] = useState(diffie(g, a, n))
  const [B, setBB] = useState(diffie(g, b, n))
  const [kAlice, setKAlice] = useState(diffie(B, a, n))
  const [kBob, setKBob] = useState(diffie(A, b, n))

  const playerRef = useRef(null)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [videoInformation, setVideoInformation] = useState({
    'intro': {show: true, duration: 60, name: "Alice und Bob", start: 0},
    'init-public': {show: true, duration: 60, name: "Öffentliche Parameter", start: 0},
    'init-private': {show: true, duration: 60, name: "Private Parameter", start: 0},
    'calc-exchange-key': {show: true, duration: 60, name: "Schlüssel berechnen", start: 0},
    'key-exchange': {show: true, duration: 60, name: "Alice und Bob", start: 0},
  })

  useEffect(() => {
    setAA(diffie(g, a, n))
    setBB(diffie(g, b, n))
  }, [a, b, n, g])

  useEffect(() => {
    setKAlice(diffie(B, a, n))
    setKBob(diffie(A, b, n))
  }, [A, B])

  return (
    <>
      <DHContext.Provider value={{a, b, n, g, A, B, kAlice, kBob, videoInformation}}>
        <div className="box">
          <div className="inline-container">
            <label htmlFor="a">
              Alice:
              <input id="a" type="number" value={a} onChange={e => setA(parseInt(e.target.value))} />
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="b">
              Bob:
              <input id="b" type="number" value={b} onChange={e => setB(parseInt(e.target.value))} />
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="g">
              Generator:
              <input id="g" type="number" value={g} onChange={e => setG(parseInt(e.target.value))} />
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="n">
              Modulo:
              <input id="n" type="number" value={n} onChange={e => setN(parseInt(e.target.value))} />
            </label>
          </div>
        </div>

        <VideoChapterContainer
          playbackRate={playbackRate}
          setPlaybackRate={setPlaybackRate}
          chapters={
            <>
              {Object.entries(videoInformation).map(([key, val]) => (
                <VideoChapterLink
                  key={key}
                  info={videoInformation}
                  setInfo={setVideoInformation}
                  playerRef={playerRef}
                  part={key}
                >
                  {val.name}
                </VideoChapterLink>
              ))}
            </>
          }
          video={
            <Player
              ref={playerRef}
              style={{width: "640px"}}
              component={DHVideo}
              durationInFrames={calcVideoDuration(videoInformation)}
              compositionWidth={1280}
              compositionHeight={720}
              fps={30}
              autoPlay={false}
              controls
              loop={true}
              playbackRate={playbackRate}
              showPlaybackRateControl={true}
            />
          }
        ></VideoChapterContainer>
      </DHContext.Provider>
    </>
  )
}

export default DiffieHellman
