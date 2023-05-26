import { useEffect } from 'react'
import { useState } from 'react'

function Verschluesselung() {
  return (
    <>
      <h2>Verschlüsselungs-Verfahren</h2>
      <section>
        <p>
        Bei einem Verschlüsselungsverfahren geht es immer darum dass man eine Nachricht (oder auch nur einen Text) für unbefugt unleserlich macht, aber befugten die Möglichkeit gibt die Nachricht zu lesen. Dafür verwendet man meistens einen Schlüssel, mit dem man die Nachricht verschlüsseln und dann wieder entschlüsseln kann.
        </p>
        <p>
          Verschlüsselungsverfahren sind in der heutigen Zeit sehr wichtig, da alle Daten die über das Internet verschickt werden im Prinzip für alle lesbar sind. Deshalb braucht es sichere Verfahren um Passwörter und andere geheime Daten zu verschlüsseln.
        </p>
        <p>
          Verschlüsselungsverfahren sind aber schon viel älter, und wurden bereits zur Zeit von Julius Caesar verwendet, und sicherlich noch früher.
        </p>
      </section>
      <section>
        <h3>Das Caesar-Verfahren</h3>
        <p>
          Zur Zeit wo es noch kein Internet oder Computer gab, musste man zum Austausch von Nachrichten zu einer anderen Person gehen, um die Nachrichten direkt auszutauschen. Da man aber nicht immer so viel Zeit hat und sehr viele Nachrichten austauschen musste, braucht man eine Person die Nachrichten an andere Personen weiterleiten kann. Damit die Nachrichten sicher ausgetauscht werden können, und die übermittelnde Person die Nachricht nicht lesen kann (Verrat oder Diebstahl), braucht es eine Möglichkeit die Nachricht so zu formulieren, dass sie nur für den Empfänger lesbar ist.
        </p>
        <p>
          Beim Caesar-Verfahren wird das ganz einfach damit gelöst, dass man das Alphabet um ein paar Stellen verschiebt. Der Schlüssel für das Caesar-Verfahren ist folglich die Verschiebung im Alphabet.
        </p>
        <p>
          Wählt man nun einen Schlüssel von 4 und möchten den Buchstaben <b>a</b> verschlüsseln, dann geht man im Alphabet einfach 4 Stellen weiter und schreibt statt einer <b>a</b> einfach eine <b>e</b>. Dies macht man für alle Buchstaben, und man hat einen Text der für unbefugt unleserlich ist.
        </p>
        <p>
          Im nächsten Kapitel folgt ein Beispiel für das Caesar-Verfahren.
        </p>
      </section>

    </>
  )
}

export default Verschluesselung