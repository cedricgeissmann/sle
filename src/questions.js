export const QUESTIONS = {
  caesar: [
    {
      question: "Das Caesarverfahren kann verwendet werden um einen Text zu verschlüsseln.",
      answers: [
        {
          text: "Ja",
          checked: false,
          correct: true,
        },
        {
          text: "Nein",
          checked: false,
          correct: false,
        },
      ],
    },
    {
      question: "Das Caesarverfahren gilt als sicheres Verschlüsselungverfahren.",
      answers: [
        {
          text: "Ja",
          checked: false,
          correct: false,
        },
        {
          text: "Nein",
          checked: false,
          correct: true,
        },
      ],
    },
    {
      question: "Der Schlüsselraum für das Caesarverfahren ist 26 Elemente gross.",
      answers: [
        {
          text: "Ja",
          checked: false,
          correct: true,
        },
        {
          text: "Nein",
          checked: false,
          correct: false,
        },
      ],
    },
    {
      question: "Wieso kann das Caesarverfahren einfach geknackt werden?",
      answers: [
        {
          text: "Weil es einen sehr kleinen Schlüsselraum hat.",
          checked: false,
          correct: true,
        },
        {
          text: "Weil es sehr alt ist.",
          checked: false,
          correct: false,
        },
      ],
    },
    {
      question: "Wie kann man das Caesarverfahren sicherer machen?",
      answers: [
        {
          text: "Man kann mehrere Verschiebungen nacheinander machen.",
          checked: false,
          correct: false,
        },
        {
          text: "Man übersetzt die Nachricht in eine andere Sprache vor dem verschlüsseln.",
          checked: false,
          correct: false,
        },
        {
          text: "Man baut absichtlich Fehler in der Verschlüsselung ein.",
          checked: false,
          correct: false,
        },
        {
          text: "Man verwendet ein durchmischtes Alphabet zusätzlich zur Verschiebung.",
          checked: false,
          correct: true,
        },
      ],
    },
  ],
  encryption: [
    {
      question:
        "Bei einem Verschlüsselungsverfahren geht es darum dass Nachrichten nur für bestimmte Empfänger lesbar sind.",
      answers: [
        {
          text: "Ja",
          checked: false,
          correct: true,
        },
        {
          text: "Nein",
          checked: false,
          correct: false,
        },
      ],
    },
    {
      question: "Ein Verschlüsselungsverfahren kann nur mit dem Schlüssel rückgängig gemacht werden.",
      answers: [
        {
          text: "Ja",
          checked: false,
          correct: true,
        },
        {
          text: "Nein",
          checked: false,
          correct: false,
        },
      ],
    },
    {
      question: "Der Schlüssel muss unbedingt geheim gehalten werden.",
      answers: [
        {
          text: "Ja",
          checked: false,
          correct: true,
        },
        {
          text: "Nein",
          checked: false,
          correct: false,
        },
      ],
    },
  ],
  vigenere: [
    {
      question: "Das Vigenere-Verfahren ist sicherer wie das Caesar-Verfahren.",
      answers: [
        {
          text: "Ja",
          checked: false,
          correct: true,
        },
        {
          text: "Nein",
          checked: false,
          correct: false,
        },
      ],
    },
  ],
}
