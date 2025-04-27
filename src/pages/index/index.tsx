import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/features";
import { Steps } from "@/components/steps";
import { Footer } from "@/components/footer";


const index = () => {


  return (
    <>
      <Header />
      <main>
        <Hero />
        <Steps />
        <Features />
      </main>
      <Footer />
    </>
  );
};

export default index;
