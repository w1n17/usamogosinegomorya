import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PromotionsPage() {
  return (
    <div className="min-h-screen bg-[#E0F2F1]/30">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-slate-900 font-bold text-[28px] sm:text-[32px]">Акции</h1>
          <div className="mt-6 text-slate-600 text-[14px] sm:text-[16px] leading-relaxed">
            Информация будет добавлена.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
