import Hint from './Hint'
import { useState } from 'react'

function AESIntro() {

  const [wordLength, setWordLength] = useState(1)

  return (
    <>
      <section>
        <h3>Das Vigenere-Verfahren</h3>
        <p>
          Das Caesar-Verfahren eignet sich nicht wirklich gut um Nachrichten sicher zu verschlüssel. Auf den ersten
          Blick mag die Nachricht zwar verschlüsselt aussehen, aber schon nur durch einfaches ausprobieren können wir
          den Schlüssel ganz schnell erraten.
        </p>
        <Hint title="Frage" hintText="Wie oft müssen Sie raten um eine Nachricht zu entschlüsseln?" />
        <p>
          Wir können den Schlüsselraum für das Caesar-Verfahren zwar erweitern, jedoch bleibt der Schlüsselraum sehr
          klein, und somit einfach zu knacken (jedenfalls für einen Computer).
        </p>
        <h3>Schlüsselraum erweitern</h3>
        <p>Um ein Verschlüsselungsverfahren sicherer zu machen, müssen wir den Schlüsselraum einfach erweitern.</p>
        <Hint title="Frage" hintText="Wieso wird das Verfahren dadurch sicherer?" />
        <p>
          Anstatt das Caesar-Verfahren auf einen ganzen Text mit einer Verschiebung anzuwenden, können wir das gleiche
          Verfahren auch pro Zeichen im Ursprünglichen Text verwenden. Dann müssen wir uns nur merken, welches Zeichen
          wir um wie viel verschieben. Das können wir mit einem Schlüsselwort machen.
        </p>
        <Hint
          title="Frage"
          hintText="Wie können die Buchstaben des Schlüsselworts für die Verschiebung verwendet werden?"
        />
        <p>
          Wenn wir <b>abcd</b> als Schlüsselwort verwenden, dann ist unser Schlüssel <b>+0, +1, +2, +3</b>.
        </p>
        <Hint title="Frage" hintText="Was passiert wenn der Text länger wie der Schlüssel ist?" />
        <h3>Grösse des Schlüsselraums</h3>
        <p>
          Die Grösse des Schlüsselraums ist dann durch die Länge des Schlüssels vorgegeben. Wenn wir nur Zeichen aus dem
          Alphabet zulassen, haben wir 26 mögliche Verschiebungen pro Stelle, das ergibt einen Schlüsselraum von 26<sup>n</sup>.
        </p>

        <div className="box">
          <div className="inline-container">
            Wortlänge: <input className="num-input" type="number" min="1" value={wordLength} onChange={e => setWordLength(e.target.value)} />
          </div>
          <div className="inline-container">
            Schlüsselraum: <span>{26 ** wordLength}</span>
          </div>
        </div>

        <Hint title="Frage" hintText="Wenn ein Computer 1000 Schlüssel in einer Sekunde testen kann, wie lange muss dass Schlüsselwort dann sein, damit die Verschlüsselung sicher ist?" />
      </section>
    </>
  )
}

export default AESIntro