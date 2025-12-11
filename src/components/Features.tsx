export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Feature 1</h3>
            <p className="text-slate-600 dark:text-slate-300">Description of feature 1</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Feature 2</h3>
            <p className="text-slate-600 dark:text-slate-300">Description of feature 2</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Feature 3</h3>
            <p className="text-slate-600 dark:text-slate-300">Description of feature 3</p>
          </div>
        </div>
      </div>
    </section>
  );
}
