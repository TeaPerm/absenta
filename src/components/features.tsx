import { Container } from "@/components/ui/container";
import React, { useId } from "react";

interface Feature {
  name: React.ReactNode;
  summary: string;
  description: string;
  image: string;
  icon: React.ComponentType;
}

const features: Array<Feature> = [
  {
    name: "Névsor generálása",
    summary: "Automatikus jelenléti ív egy kattintással.",
    description:
      "Töltsd fel a hallgatói adatokat, és töltsd le a nyomtatható ívet pillanatok alatt.",
    image:
      "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg",
    icon: function ListIcon() {
      return (
        <>
          <path
            d="M8 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="#fff"
          />
          <path
            opacity=".5"
            d="M8 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="#fff"
          />
          <path
            opacity=".3"
            d="M8 24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="#fff"
          />
        </>
      );
    },
  },
  {
    name: "Képfelismerés",
    summary: "Aláírások felismerése mesterséges intelligenciával.",
    description:
      "Fotózd le a jelenléti ívet – az Absenta automatikusan feldolgozza.",
    image:
      "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg",
    icon: function ImageRecognitionIcon() {
      const id = useId()
      return (
        <>
          <defs>
            <linearGradient
              id={id}
              x1="11.5"
              y1={18}
              x2={36}
              y2="15.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".194" stopColor="#fff" />
              <stop offset={1} stopColor="#6692F1" />
            </linearGradient>
          </defs>
          <path
            d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5"
            stroke={`url(#${id})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    },
  },
  {
    name: "Neptun export",
    summary: "Exportálás Neptun-kompatibilis fájlba.",
    description:
      "Azonnali fájlgenerálás a Neptun rendszerbe való feltöltéshez.",
    image:
      "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg",
    icon: function ExportIcon() {
      return (
        <>
          <path
            d="M12 28.395V28a6 6 0 0 1 12 0v.395A11.945 11.945 0 0 1 18 30c-2.186 0-4.235-.584-6-1.605Z"
            fill="#fff"
          />
          <path
            d="M21 16.5c0-1.933-.5-3.5-3-3.5s-3 1.567-3 3.5 1.343 3.5 3 3.5 3-1.567 3-3.5Z"
            fill="#fff"
          />
        </>
      );
    },
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-label="Features for simplifying everyday business tasks"
      className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Forradalmasítsa a jelenléti adminisztrációt
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Az Absenta intelligens megoldásaival akár 80%-kal csökkentheti az
            adminisztrációra fordított időt, miközben pontosabb és megbízhatóbb
            nyilvántartást vezet.
          </p>
        </div>

        {/* Bento Grid Implementation */}
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Mobile Friendly Feature - Larger Card */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <div className="flex items-center">
                  <div className="w-9 rounded-lg bg-blue-600">
                    <svg aria-hidden="true" className="h-9 w-9" fill="none">
                    {React.createElement(features[2].icon)}
                    </svg>
                  </div>
                  <p className="ml-4 text-lg font-medium tracking-tight text-gray-950">
                    {features[0].name}
                  </p>
                </div>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  {features[0].description}
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img
                    className="size-full object-cover object-top"
                    src={features[0].image}
                    alt={features[0].name as string}
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
          </div>

          {/* Performance Feature */}
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <div className="flex items-center max-lg:justify-center">
                  <div className="w-9 rounded-lg bg-blue-600">
                    <svg aria-hidden="true" className="h-9 w-9" fill="none">
                      {React.createElement(features[1].icon)}
                    </svg>
                  </div>
                  <p className="ml-4 text-lg font-medium tracking-tight text-gray-950">
                    {features[1].name}
                  </p>
                </div>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  {features[1].description}
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <img
                  className="w-full max-lg:max-w-xs"
                  src={features[1].image}
                  alt={features[1].name as string}
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
          </div>

          {/* Security Feature */}
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-white"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <div className="flex items-center max-lg:justify-center">
                  <div className="w-9 rounded-lg bg-blue-600">
                    <svg aria-hidden="true" className="h-9 w-9" fill="none">
                    {React.createElement(features[2].icon)}
                    </svg>
                  </div>
                  <p className="ml-4 text-lg font-medium tracking-tight text-gray-950">
                    {features[2].name}
                  </p>
                </div>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  {features[2].description}
                </p>
              </div>
              <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                <img
                  className="h-[min(152px,40cqw)] object-cover"
                  src={features[2].image}
                  alt={features[2].name as string}
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
          </div>

          {/* API Feature - Code Example Card */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Automatizált folyamatok
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Az Absenta API-kapcsolatokkal segít integrálni a jelenléti adatokat az oktatási rendszerekbe.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow">
                <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                  <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                      <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                        AbsentaAPI.js
                      </div>
                      <div className="border-r border-gray-600/10 px-4 py-2">App.js</div>
                    </div>
                  </div>
                  <div className="px-6 pb-14 pt-6 text-sm text-gray-300">
                    <pre>
{`// Absenta API integráció
const processAttendance = async (imageData) => {
  const response = await absenta.analyze({
    course_id: "CSC101",
    image: imageData,
    date: new Date()
  });
  
  // Automatikus Neptun exportálás
  if (response.success) {
    await absenta.exportToNeptun(response.data);
    console.log("Sikeres exportálás");
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          </div>
        </div>
      </Container>
    </section>
  );
}