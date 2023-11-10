import Heading from "./_components/Heading";
import Footer from "./_components/Footer";
import Heroes from "./_components/Heroes";


const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col gap-y-8 items-center justify-center md:justify-start text-center flex-1 px-6 pb-10">
        <Heading />

        <Heroes />
      </div>

      <Footer />
    </div>
  );
};

export default MarketingPage;
