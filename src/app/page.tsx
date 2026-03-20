import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Rooms from "@/components/Rooms";
import Amenities from "@/components/Amenities";
import ApartmentRentalSection from "@/components/ApartmentRentalSection";
import ApartmentAvailabilityCalendar from "@/components/ApartmentAvailabilityCalendar";
import WaterActivitiesSection from "@/components/WaterActivitiesSection";
import Footer from "@/components/Footer";

// Главная страница мини-гостиницы
export default function Home() {
  return (
    <div className="min-h-screen bg-[#E0F2F1]/30">
      <Header />
      <main>
        <Hero />
        <Welcome />
        <Rooms />
        <Amenities />
        <ApartmentRentalSection />
        <ApartmentAvailabilityCalendar />
        <WaterActivitiesSection />
      </main>
      <Footer />
    </div>
  );
}
