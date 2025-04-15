import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/features";
import { Steps } from "@/components/steps";

const index = () => {


  return (
    <>
      <Header />
      <main>
        <Hero />
        <Steps />
        <Features />
      </main>
    </>
  );
};

export default index;
