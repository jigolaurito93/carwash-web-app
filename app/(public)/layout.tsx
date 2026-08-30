import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import TopBanner from "@/components/TopBanner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 z-10">
        <TopBanner />
        <Navbar />
      </div>
      {children}
      <Footer />
    </>
  );
}
