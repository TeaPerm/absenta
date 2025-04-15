import { useEffect, useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/ui/container'
import backgroundImage from '@/assets/background-features.jpg'
import screenshotExpenses from '@/assets/expenses.png'
import screenshotPayroll from '@/assets/payroll.png'
import screenshotReporting from '@/assets/reporting.png'
import screenshotVatReturns from '@/assets/vat-returns.png'

const features = [
  {
    title: 'Névsor generálás',
    description:
      'Digitalizálja a hallgatói névsorokat pillanatok alatt! A felhasználóbarát felületen könnyedén importálhat meglévő listákat vagy adhat hozzá új hallgatókat. Az Absenta automatikusan ellenőrzi a Neptun-kódok helyességét és rendszerezi a kurzus résztvevőit.',
    image: screenshotPayroll,
  },
  {
    title: 'Jelenléti ív feldolgozás',
    description:
      'Forradalmi AI technológiánk felismeri a kézírásos aláírásokat és automatikusan rögzíti a jelenléti adatokat. Nincs többé órákig tartó manuális adatbevitel – egyszerűen készítsen egy fotót a papíralapú jelenléti ívről, és az Absenta elvégzi a munkát Ön helyett.',
    image: screenshotExpenses,
  },
  {
    title: 'Valós idejű jelenlét követés',
    description:
      'Növelje a hatékonyságot a helyszíni jelenlét-kezeléssel! Használja mobileszközét a bármikor, bárhonnan elérhető rendszerben, jelölje meg egy érintéssel a megjelent, késő vagy hiányzó hallgatókat. A változások azonnal szinkronizálódnak a felhőalapú adatbázissal.',
    image: screenshotVatReturns,
  },
  {
    title: 'Átfogó statisztikák és jelentések',
    description:
      'Fedezze fel az adatokban rejlő mintázatokat interaktív grafikonokkal és részletes kimutatásokkal! Az Absenta vizuálisan jeleníti meg a részvételi trendeket, automatikus figyelmeztetéseket küld a kritikus hiányzásokról, és a jelentéseket egyetlen kattintással exportálhatja különböző formátumokba.',
    image: screenshotReporting,
  },
]

export function PrimaryFeatures() {
  const [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  )

  useEffect(() => {
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label="Fő funkciók"
      className="relative overflow-hidden bg-blue-600 pt-20 pb-28 sm:py-32"
    >
      <img
        className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Felejtse el a papírmunkát – a jövő jelenléti rendszere megérkezett
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            Az Absenta teljeskörű megoldást kínál oktatóknak, amely 80%-kal csökkenti az adminisztrációra fordított időt, miközben pontos és megbízható adatokat szolgáltat a hallgatói részvételről.
          </p>
        </div>
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg data-selected:not-data-focus:outline-hidden',
                            selectedIndex === featureIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <TabPanels className="lg:col-span-7">
                {features.map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <img
                        className="w-full"
                        src={feature.image}
                        alt=""
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  )
}
