import { FileText, Upload, Camera, Download } from "lucide-react";
import { Container } from "./ui/container";

export function Steps() {
  return (
    <section id="steps">
      <Container className="mt-24 lg:mt-32">
        <div className="relative overflow-visible py-4">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-visible -z-10">
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-20">
              <svg
                viewBox="0 0 800 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <circle cx="400" cy="400" r="400" fill="url(#stepsGradient)" />
                <defs>
                  <radialGradient
                    id="stepsGradient"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(400 400) rotate(90) scale(400)"
                  >
                    <stop stopColor="#1E40AF" />
                    <stop offset="1" stopColor="#1E40AF" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h2 className="text-center text-4xl font-bold tracking-tight text-slate-900">
            Négy egyszerű lépés a jelenléti ívek digitalizálásához
          </h2>
          <p className="text-center mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Alkalmazásunk egyszerűsíti a jelenléti adatok rögzítését és
            kezelését.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-600 relative left-[-2rem] top-[2rem]" />
              </div>
              <div className="flex justify-center items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white mb-4">
                  <span className="font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Névsor generálás
              </h3>
              <p className="mt-4 text-slate-600">
                Töltse fel a hallgatói névsort és generáljon nyomtatható
                sablonokat.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600 relative left-[-2rem] top-[2rem]" />
              </div>
              <div className="flex justify-center items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white mb-4">
                  <span className="font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Adatgyűjtés</h3>
              <p className="mt-4 text-slate-600">
                A hallgatók aláírják a kinyomtatott jelenléti ívet.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                <Camera className="h-8 w-8 text-blue-600 relative left-[-2rem] top-[2rem]" />
              </div>
              <div className="flex justify-center items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white mb-4">
                  <div className="font-bold text-center justify-center items-center">
                    3
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Képfeldolgozás
              </h3>
              <p className="mt-4 text-slate-600">
                Készítsen fényképet az aláírt ívről, és algoritmusunk felismeri
                az aláírásokat.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                <Download className="h-8 w-8 text-blue-600 relative left-[-2rem] top-[2rem]" />
              </div>
              <div className="flex justify-center items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white mb-4">
                  <span className="font-bold">4</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Adatexportálás
              </h3>
              <p className="mt-4 text-slate-600">
                Exportálja a jelenléti adatokat az egyetemi rendszerekkel
                kompatibilis formátumban.
              </p>
            </div>
          </div>

          {/* Wave decoration */}
          <div className="absolute bottom-[-2px] left-0 right-0 -z-10">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 80C840 80 960 70 1080 65C1200 60 1320 60 1380 60L1440 60V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z"
                fill="#f8fafc"
              />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
