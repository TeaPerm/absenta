import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { Container } from "@/components/ui/container";
import { useId } from "react";

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

function Feature({
  feature,
  isActive,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  feature: Feature;
  isActive: boolean;
}) {
  return (
    <div
      className={clsx(className, !isActive && "opacity-75 hover:opacity-100")}
      {...props}
    >
      <div
        className={clsx(
          "w-9 rounded-lg",
          isActive ? "bg-blue-600" : "bg-slate-500"
        )}
      >
        <svg aria-hidden="true" className="h-9 w-9" fill="none">
          <feature.icon />
        </svg>
      </div>
      <h3
        className={clsx(
          "mt-6 text-sm font-medium",
          isActive ? "text-blue-600" : "text-slate-600"
        )}
      >
        {feature.name}
      </h3>
      <p className="mt-2 font-display text-xl text-slate-900">
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  );
}

function FeaturesMobile() {
  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.summary}>
          <Feature feature={feature} className="mx-auto max-w-2xl" isActive />
          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 top-8 bottom-0 bg-slate-200 sm:-inset-x-6" />
            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white ring-1 shadow-lg shadow-slate-900/5 ring-slate-500/10">
              <img
                className="w-full"
                src={feature.image}
                alt=""
                sizes="52.75rem"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop() {
  return (
    <TabGroup className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <TabList className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <Feature
                key={feature.summary}
                feature={{
                  ...feature,
                  name: (
                    <Tab className="data-selected:not-data-focus:outline-hidden">
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  ),
                }}
                isActive={featureIndex === selectedIndex}
                className="relative"
              />
            ))}
          </TabList>
          <TabPanels className="relative mt-20 overflow-hidden rounded-4xl bg-slate-200 px-14 py-16 xl:px-16">
            <div className="-mx-5 flex">
              {features.map((feature, featureIndex) => (
                <TabPanel
                  static
                  key={feature.summary}
                  className={clsx(
                    "px-5 transition duration-500 ease-in-out data-selected:not-data-focus:outline-hidden",
                    featureIndex !== selectedIndex && "opacity-60"
                  )}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  aria-hidden={featureIndex !== selectedIndex}
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white ring-1 shadow-lg shadow-slate-900/5 ring-slate-500/10">
                    <img
                      className="w-full"
                      src={feature.image}
                      alt=""
                      sizes="52.75rem"
                    />
                  </div>
                </TabPanel>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-slate-900/10 ring-inset" />
          </TabPanels>
        </>
      )}
    </TabGroup>
  );
}

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
        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  );
}
