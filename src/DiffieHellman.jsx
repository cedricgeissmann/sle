import { useEffect, useState, createContext, useContext } from 'react'
import { Player } from '@remotion/player'
import './Vigenere.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps, Video } from 'remotion'
import { LetterList, Letter, ShiftingLetter } from './LetterList'
import { keyToAlphabet, shiftChar} from './utils'
import { VideoElement, VideoTransform, MySequence } from './Video'

const DHContext = createContext(null)

function diffie(base, exp, mod) {
  return (base ** exp) % mod
}

function DHVideo() {
  const frame = useCurrentFrame()
  const {a,b,n,g,A,B,kAlice,kBob} = useContext(DHContext)
  
  return (
    <>
      <MySequence from={0} durationInFrames={120}>
        <VideoElement top={120} left="200px">
          <h2>Alice</h2>
          <VideoElement top={100}>
            <span>a={a}</span>
          </VideoElement>
          <VideoElement top={180}>
            <span>
              <VideoElement
                left={() =>
                  interpolate(frame, [30, 60], [0, 800], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})
                }
                top={() =>
                  interpolate(frame, [30, 60], [0, 100], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})
                }
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
              <VideoTransform
                from="K"
                to={kAlice}
              />
            </span>
            <span
              style={{
                opacity: interpolate(frame, [60, 90], [1, 0], {extrapolateRight: "clamp", extrapolateLeft: "clamp"}),
              }}
            >B^a mod n</span>
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
                top={() =>
                  interpolate(frame, [30, 60], [0, 100], {extrapolateRight: "clamp", extrapolateLeft: "clamp"})
                }
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
            >=A^b mod n</span>
          </VideoElement>
        </VideoElement>
      </MySequence>
    </>
  )
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
      <DHContext.Provider value={{a,b,n,g,A,B,kAlice,kBob}}>
        <div className="box">
          <div className="inline-container">
            <label htmlFor="a">
              Alice:
              <input id="a" type="number" value={a} onChange={e => setA(parseInt(e.target.value))}/>
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="b">
              Bob:
              <input id="b" type="number" value={b} onChange={e => setB(parseInt(e.target.value))}/>
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="g">
              Generator:
              <input id="g" type="number" value={g} onChange={e => setG(parseInt(e.target.value))}/>
            </label>
          </div>
          <div className="inline-container">
            <label htmlFor="n">
              Modulo:
              <input id="n" type="number" value={n} onChange={e => setN(parseInt(e.target.value))}/>
            </label>
          </div>
        </div>

        <div className="video-container">
          <Player
            style={{height: "240px"}}
            component={DHVideo}
            durationInFrames={120}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            autoPlay={true}
            controls
            loop={true}
          />
        </div>
      </DHContext.Provider>
    </>
  )
}

export default DiffieHellman
