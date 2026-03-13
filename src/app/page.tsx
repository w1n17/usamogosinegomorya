import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Rooms from "@/components/Rooms";
import Amenities from "@/components/Amenities";
import Footer from "@/components/Footer";

// Главная страница мини-гостиницы
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Welcome />
        <Rooms />
        <Amenities />
      </main>
      <Footer />
    </div>
  );
}
