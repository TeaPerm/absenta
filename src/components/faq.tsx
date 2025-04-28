const faqs = [
    {
      id: 1,
      question: "Mi az Absenta?",
      answer:
        "Az Absenta egy modern hiányzáskezelő rendszer oktatási intézmények számára. A rendszer segítségével egyszerűen kezelhetők a hallgatók hiányzásai és készíthetők statisztikák.",
    },
    {
      id: 2,
      question: "Hogyan tudok új kurzust létrehozni?",
      answer:
        "A 'Kurzusok' menüpont alatt található az 'Új kurzus' gomb. Itt megadhatja a kurzus alapvető adatait és a hallgatók listáját.",
    },
    {
      id: 3,
      question: "Hogyan tudom importálni a hallgatók listáját?",
      answer:
        "A hallgatók listáját CSV fájl formátumban importálhatja.",
    },
    {
      id: 4,
      question: "Milyen típusú jelenléteket tudok rögzíteni?",
      answer:
        "A rendszerben rögzíthető megjelent, nem jelent meg, igazolt hiányzás, valamint késés.",
    },
    {
      id: 5,
      question: "Hogyan készíthetek jelentéseket a hiányzásokról?",
      answer:
        "A jelenlétí ívek almenüben az 'Exportálás' opcióval exportálhatja a jelenlétí íveket.",
    },
    {
      id: 6,
      question: "Nem működik a képfelismerő rendszer?",
      answer:
        "A képfelismerő legjobban az oldal által generált jelenlétí íveken működik. Előnyös kék tollal aláírni a jelenléti íveket, mivel így a képfelismerő jobban működik.",
    },
  ]
  
  export function FAQ() {
    return (
      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Gyakran ismételt kérdések
            </h2>
            <p className="mt-6 text-base/7 text-gray-600">
              Nem találja a választ a kérdésére? Küldjön nekünk egy{' '}
              <a href="mailto:lethiennam111@gmail.com" className="font-semibold text-theme hover:text-theme/60">
                e-mailt
              </a>{' '}
              és hamarosan válaszolunk.
            </p>
          </div>
          <div className="mt-20">
            <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <dt className="text-base/7 font-semibold text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-base/7 text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    )
  }
  