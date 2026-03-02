import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import Welcome from "@/components/Welcome";
import ShopInfoSection from "@/components/ShopInfoSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <ShopInfoSection />
      <ServicesSection />
      <Welcome />
    </div>
  );
}
