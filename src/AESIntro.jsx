import Hint from './Hint'
import { useState } from 'react'

function AESIntro() {

  const [wordLength, setWordLength] = useState(1)

  return (
    <>
      <section>
        <h3>Das AES-Verfahren</h3>
        <p>
          <b>AES</b> steht für Advanced Encryption Standard und ist eines der meist genutzten symmetrischen Verschlüsselungsverfahren. AES gibt es in verschiedenen Varianten, wir schauen hier aber nur AES-128 an. Dieses reicht völlig aus von der Sicherheit. AES wird immer verwendet wenn eine <b>https</b>-Verbindung zu einer Webseite erstellt wird. Es ist somit die Grundlage für sicheren surfen im Internet und muss deshalb auch sehr schnell sein. 
        </p>
        <Hint title='Hinweis!' hintText='Symmetrische Verschlüsselungsverfahren sind in der regel schneller als asymmetrische.' />
        <p>
          AES ist ein Blockverschlüsselungsverfahren, das bedeutet dass es jeweils auf einem Block im Speicher angewendet wird. Bei AES-128 sind das jeweils 128 Bits oder 16 Bytes. Diese verschlüsselten Blöcke können dann jeweils direkt als Pakete verschickt werden, so wird eine effiziente verschlüsselte Übertragung gewährleistet.
        </p>
      </section>
      <section>
        <h4>Runden</h4>
        <p>
          AES funktioniert in mehreren Runden und hat in jeder Runde mehrere Schritte. Bei AES-128 sind es insgesamt 10 Runden. In jeder Runde wird der Speicherblock mit einem Rundenschlüssel verschlüsselt, dann werden die Bits in dem Speicherblock nach einem genauen Schema durchmischt. Dadurch wird es extrem aufwendig die Verschlüsselung zu erraten, wenn der Schlüssel nicht bekannt ist. Hat man jedoch den Schlüssel, können die einzelnen Schritte schnell und effizient wieder rückgängig gemacht werden.
        </p>
        <Hint title='Frage' hintText='Wovor soll das Durchmischen genau schützen?' />
        <h4>Schlüsselerweiterung</h4>
        <p>
          Da in jeder Runde ein neuer Schlüssel gebraucht wird, wird der Schlüssel zuerst auf die volle Grösse erweitert. Dazu wird für jeden neuen Eintrag in dem Schlüsselblock, der Eintrag aus der Runde davor verwendet, dieser wird dann jeweils mit einer Rundenkonstanten erweitert und verschoben. Damit kann in jeder Runde ein neuer Schlüssel erzeugt werden.
        </p>
        <Hint title='Frage' hintText='Wieso wird nicht immer der gleiche Schlüssel verwendet?' />
        <p>
          In der ersten Runde wird der ursprüngliche Schlüssel verwendet, danach jeweils der Rundenschlüssel.
        </p>
      </section>
      <section>
        <h3>Rundenablauf</h3>
        <p>
        <b>Schlüssel hinzufügen:</b> Zu beginn einer Runde wird jeweils der ganze Speicherblock mit dem Rundenschlüssel bitweise <b>XOR</b> gerechnet.
        </p>
        <p>
          <b>Bytes ersetzen:</b> Nachdem der Schlüssel angewendet wurde, wird der Speicherblock durchmischt. Dabei wird jede Zelle mit einem Wert ersetzt, der in einer Tabelle nachgeschaut wird. Dieser Schritt is einfach umkehrbar, denn auch das kann nachgeschaut werden.
        </p>
        <p>
          <b>Zeilen verschieben:</b> Im nächsten Schritt werden die Zeilen in dem Block so verschoben, dass pro Zeile um eine Zelle mehr nach links verschoben wird.
        </p>
        <p>
          <b>Spalten mischen:</b> In diesem Schritt werden die Bytes innerhalb einer Spalte miteinander gemischt. Dieser Schritt wird in der letzten Runde weggelassen, um unnötige Berechnungen einzusparen.
        </p>
        <Hint title='Hinweis!' hintText='All diese Schritte braucht es damit die Bits in dem Speicherblock möglichst stark gemischt werden.'></Hint>
      </section>
    </>
  )
}

export default AESIntro