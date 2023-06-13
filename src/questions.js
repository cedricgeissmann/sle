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
    {
      question: "Das Caesarverfahren ist ein modernes kryptographisches Verfahren, das heute noch häufig verwendet wird.",
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
      question: "Eine Caesar-Verschlüsselung mit dem Schlüssel 3 würde den Buchstaben 'A' in den Buchstaben 'D' verschlüsseln.",
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
      question: "Das Caesarverfahren kann auf beliebige Zeichen angewendet werden, nicht nur auf Buchstaben.",
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
      question: "Was passiert beim Caesarverfahren, wenn ein Schlüssel der grösser als 26 ist, verwendet wird.",
      answers: [
        {
          text: "Es wird ein 'Z' geschrieben.",
          checked: false,
          correct: false,
        },
        {
          text: "Das Zeichen wird mit einem '.' ersetzt.",
          checked: false,
          correct: false,
        },
        {
          text: "Das Alphabet beginnt wieder von vorne.",
          checked: false,
          correct: true,
        },
        {
          text: "Der Buchstabe wird nicht verschoben.",
          checked: false,
          correct: false,
        },
      ],
    },
    {
      question: "Wird das Caesarverfahren 2 mal direkt hintereinander angewendet, so wird die Verschlüsselung sicherer.",
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
    {
      question: "Das Internet würde auch ohne Verschlüsselung funktionieren.",
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
      question: "Verschlüsselungsverfahren müssen immer umkehrbar sein.",
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
    {
      question: "Der Schlüsselraum des Vigenère-Verfahrens mit einem Schlüsselwort der Länge 6 ist 26^6.",
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
      question: "Das Vigenère-Verfahren mit dem Schlüsselwort 'AAAAAA', bewirkt keine Verschlüsselung.",
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
      question: "Bei einem Schlüsselwort der Länge 1, sind das Caesar und das Vigenère-Verfahren genau gleich.",
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
      question: "Bei einem Schlüsselwort der Länge 1, sind das Caesar und das Vigenère-Verfahren genau gleich.",
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
      question: "Die Sicherheit des Vigenère-Verfahrens liegt nur in der Länge des Schlüssels, nicht in der Vielfalt der Zeichen.",
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
  ],
  'diffie-hellman': [
    {
      question: "Braucht das Diffie-Hellman-Quiz mehr Fragen?",
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
  'aes': [
    {
      question: "Braucht das AES-Quiz mehr Fragen?",
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
  ]
}
