import Hint from './Hint'
import { useState } from 'react'
import { useEffect } from 'react'

function DiffieHellmanIntro() {

  const [a, setA] = useState(5)
  const [b, setB] = useState(11)
  const [p, setP] = useState(29)
  const [g, setG] = useState(13)
  const [k, setK] = useState(0)
  const [K, setKK] = useState(0)

  useEffect(() => {
    setK((g**a) % p)
    setKK((k**b) % p)
  }, [a, b, g, p, k])

  return (
    <>
      <section>
        <h3>Der Diffie-Hellman Schlüsselaustausch</h3>
        <p>
          Das Diffie-Hellman verfahren ist eines der zentralen Elemente in der modernen Kryptografie. Das Verfahren ermöglicht das austauschen, oder besser gesagt; generieren, eines Schlüssels, über ein unsicheres Medium. Es können also Schlüssel generiert werden, ohne das sich die Parteien im geheimen treffen müssen, oder sich über ein bereits verschlüsseltes Medium austauschen müssen.
        </p>
        <Hint title="Frage" hintText="Weshalb ist das wichtig?" />
        <p>
          Das Diffie-Hellman-Verfahren nutzt dabei eine mathematische eigenschaft der Division mit Rest aus. Dies ermöglicht es den Kommunikationspartnern ein paar einfache Rechnungen durchzuführen, und eine Zahl zu verschicken, so das am Ende beide die gleiche Zahl ausgerechnet haben, und sonst niemand auf diese Zahl kommen könnte.
        </p>
        <Hint title='Frage' hintText='Wieso muss der Schlüssel berechnet werden, und kann nicht einfach verschickt werden?' />
        <h3>Runden</h3>
        <p>
          Der Diffie-Hellman-Schlüsselaustausch ist in 3 Runden eingeteilt. Diese 3 Runden werden auf unverschlüsselten Verbindungen ausgeführt. Nach diesen 3 Runden ist alles verschlüsselt. Die Zahlen die in dieser Phase ausgetauscht werden kann jeder mithören, es bringt jedoch nichts um den tatsächlichen Schlüssel zu berechnen.
        </p>
        <p>
          <b>Phase 1: </b>Beide Kommunikationspartner einigen sich auf 2 Zahlen. Die Generator Zahl <b>g</b> und eine sehr grosse Primzahl <b>p</b>. Ausserdem suchen sich beide noch ein Zufallszahl <b>a</b> bzw. <b>b</b> aus. Diese bleiben aber geheim.
        </p>
        <p>
          Nun werden die Zahlen <b>A</b> und <b>B</b> jeweils wie folgt berechnet:
          <div className="box">
            <div className='inline-container' style={{gap: '2rem'}}>
              <label htmlFor="a">
                a =
                <input style={{marginLeft: '0.5rem'}} type="number" className='num-input' value={a} onChange={(e) => setA(e.target.value)} />
              </label>
              <label htmlFor="g">
                g =
                <input style={{marginLeft: '0.5rem'}} type="number" className='num-input' value={g} onChange={(e) => setG(e.target.value)} />
              </label>
              <label htmlFor="p">
                p =
                <input style={{marginLeft: '0.5rem'}} type="number" className='num-input' value={p} onChange={(e) => setP(e.target.value)} />
              </label>
              <label htmlFor="b">
                b =
                <input style={{marginLeft: '0.5rem'}} type="number" className='num-input' value={b} onChange={(e) => setB(e.target.value)} />
              </label>
            </div>
            <div className='inline-container' style={{fontSize: '2rem', gap: '1.5rem'}}>
              <span>A =</span><span>g^a % p = </span><span>{g}^{a} % {p} =</span><span>{k}</span>
            </div>
          </div>
        </p>
        <p>
          Von diesen Zahlen kann nicht auf die eigentlich Geheimzahl geschlossen werden.
        </p>
        <Hint title="Frage" hintText='Wieso ist das wichtig?'/>
        <p>
          Diese Zahlen werden dann ausgetauscht.
        </p>
        <p>
          <b>Phase 2:</b> Hier wird der Schlüssel mit den ausgetauschten Zahlen berechnet.
          <div className="box">
            <div className='inline-container' style={{fontSize: '2rem', gap: '1.5rem'}}>
              <span>K =</span><span>A^b % p = </span><span>{k}^{b} % {p} =</span><span>{K}</span>
            </div>
          </div>
        </p>
        <p>
          Der gemeinsame Schlüssel den beide berechnet haben, ist dann {K}.
        </p>
        <Hint title='Frage' hintText='Was passiert wenn a und b vertauscht werden?' />
      </section>
    </>
  )
}

export default DiffieHellmanIntro