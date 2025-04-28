import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/features";
import { Steps } from "@/components/steps";
import { Footer } from "@/components/footer";
import { FAQ } from "@/components/faq";

const index = () => {


  return (
    <>
      <Header />
      <main>
        <Hero />
        <Steps />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default index;
