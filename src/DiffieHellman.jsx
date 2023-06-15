import { useEffect, useState, createContext, useContext } from 'react'
import { Player } from '@remotion/player'
import './Vigenere.css'
import { useCurrentFrame } from 'remotion'
import { VideoElement, MySequence, VideoChapterContainer, VideoChapterLink, calcVideoDuration, inter, VideoTransformF } from './Video'
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
        <VideoElement top="150px" transparency={opacity}>
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
        <VideoElement top="180px" transform={opacity}>
          a={a}
        </VideoElement>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={"scale(2)"}>
        <h2>Bob</h2>
        <VideoElement top="180px" transform={opacity}>
          b={b}
        </VideoElement>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
        <VideoElement top="150px" opacity={1}>
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
  const {g, n, a, b, A, B, videoInformation} = useContext(DHContext)

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement left='20%' top="10%" transform={"scale(2)"}>
        <h2>Alice</h2>
        <VideoElement top="180px">
          <VideoTransformF states={["g^a % n", `${g}^${a} % ${n}`, `${A}`]} />
        </VideoElement>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={"scale(2)"}>
        <h2>Bob</h2>
        <VideoElement top="180px">
          <VideoTransformF states={["g^b % n", `${g}^${b} % ${n}`, `${B}`]} />
        </VideoElement>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
        <VideoElement top="150px" opacity={1}>
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

function ExchangeKeySequence() {
  const PART = 'key-exchange'
  const frame = useCurrentFrame()
  const {g, n, A, B, videoInformation} = useContext(DHContext)

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement left='20%' top="10%" transform={"scale(2)"}>
        <h2>Alice</h2>
        <VideoElement top="180px" left={() => inter(frame, videoInformation[PART], [0, 380])}>
          {A}
        </VideoElement>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={"scale(2)"}>
        <h2>Bob</h2>
        <VideoElement top="180px" right={() => inter(frame, videoInformation[PART], [0, 380])}>
          {B}
        </VideoElement>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
        <VideoElement top="150px" opacity={1}>
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

function CalcFinalKeySequence() {
  const PART = 'calc-final-key'
  const {g, n, a, b, A, B, kAlice, kBob, videoInformation} = useContext(DHContext)

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement left='20%' top="10%" transform={"scale(2)"}>
        <h2>Alice</h2>
        <VideoElement top="180px">
          <VideoTransformF states={["B^a % n", `${B}^${a} % ${n}`, `${kAlice}`]} />
        </VideoElement>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={"scale(2)"}>
        <h2>Bob</h2>
        <VideoElement top="180px">
          <VideoTransformF states={["A^b % n", `${A}^${b} % ${n}`, `${kBob}`]} />
        </VideoElement>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
        <VideoElement top="150px" opacity={1}>
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

function ShowKeySequence() {
  const PART = 'show-key'
  const frame = useCurrentFrame()
  const {g, n, kAlice, kBob, videoInformation} = useContext(DHContext)

  function transform() {
    const grow = inter(frame, videoInformation[PART], [1, 3])
    return `scale(${grow})`
  }

  return (
    <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
      <VideoElement left='20%' top="10%" transform={"scale(2)"}>
        <h2>Alice</h2>
        <VideoElement top="180px" transform={transform}>
          {kAlice}
        </VideoElement>
      </VideoElement>
      <VideoElement right='20%' top="10%" transform={"scale(2)"}>
        <h2>Bob</h2>
        <VideoElement top="180px" transform={transform}>
          {kBob}
        </VideoElement>
      </VideoElement>
      <VideoElement top="10%">
        <h2>Public</h2>
        <VideoElement top="150px" opacity={1}>
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

function DHVideo() {
  const frame = useCurrentFrame()
  const {a, b, n, g, A, B, kAlice, kBob, videoInformation} = useContext(DHContext)

  return <>
    {videoInformation["intro"].show && <IntroSequence />}
    {videoInformation["init-public"].show && <PublicInitSequence />}
    {videoInformation["init-private"].show && <PrivateInitSequence />}
    {videoInformation["calc-exchange-key"].show && <CalcExchangeKeySequence />}
    {videoInformation["key-exchange"].show && <ExchangeKeySequence />}
    {videoInformation["calc-final-key"].show && <CalcFinalKeySequence />}
    {videoInformation["show-key"].show && <ShowKeySequence />}
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
    'calc-exchange-key': {show: true, duration: 240, name: "Schlüssel berechnen", start: 0},
    'key-exchange': {show: true, duration: 60, name: "Schlüssel austauschen", start: 0},
    'calc-final-key': {show: true, duration: 240, name: "Schlüssel berechnen", start: 0},
    'show-key': {show: true, duration: 60, name: "Schlüssel anzeigen", start: 0},
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
          <div className="input-area inline-container">
            <label htmlFor="a">
              Alice:
              <input className="num-input" id="a" type="number" value={a} onChange={e => setA(parseInt(e.target.value))} />
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="b">
              Bob:
              <input className="num-input" id="b" type="number" value={b} onChange={e => setB(parseInt(e.target.value))} />
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="g">
              Generator:
              <input className="num-input" id="g" type="number" value={g} onChange={e => setG(parseInt(e.target.value))} />
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="n">
              Modulo:
              <input className="num-input" id="n" type="number" value={n} onChange={e => setN(parseInt(e.target.value))} />
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
              style={{width: "640px", fontSize: '2rem'}}
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
