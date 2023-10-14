import NavBar from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full dark:bg-[#1F1F1F]">
      <NavBar />

      <section className="h-full pt-40">{children}</section>
    </main>
  );
};

export default MarketingLayout;
