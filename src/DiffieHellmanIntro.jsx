import Hint from './Hint'
import { useState } from 'react'

function DiffieHellmanIntro() {

  const [wordLength, setWordLength] = useState(1)

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
          <div className="inline-container">

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
          <b>Phase 2:</b>
        </p>
      </section>
    </>
  )
}

export default DiffieHellmanIntro