import { Header } from "./components/Header";
import { BlogCatalogue } from "./components/BlogCatalogue";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BlogCatalogue />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
