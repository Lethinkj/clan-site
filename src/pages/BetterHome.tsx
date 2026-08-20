import Navbar from "../components/betterhome/Navbar";
import HeroSection from "../components/betterhome/HeroSection";
import StatsSection from "../components/betterhome/StatsSection";
import CodeOfAuraSection from "../components/betterhome/CodeOfAuraSection";
import CallToActionSection from "../components/betterhome/CallToActionSection";
import Footer from "../components/betterhome/Footer";
import VillageAssistant from "../components/betterhome/VillageAssistant";

export default function BetterHome() {
  return (
    <main className="relative bg-[#0B0F19] text-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <CodeOfAuraSection />
      <CallToActionSection />
      <Footer />
      <VillageAssistant />
    </main>
  );
}
