
import { useEffect } from "react";
import { PromoBar } from "../components/PromoBar";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { CreationCard } from "../components/CreationCard";
import { QuickStartItem } from "../components/QuickStartItem";
import { FeaturedAppCard } from "../components/FeaturedAppCard";
import { ModelCard } from "../components/ModelCard";
import { Rocket, Search, Users, Book } from "lucide-react";

const Index = () => {
  useEffect(() => {
    document.title = "Index - GetYoVids";
  }, []);

  const handleCloseSidebar = () => {
    // Handle sidebar close if needed
    console.log("Sidebar closed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <PromoBar />
      <div className="flex">
        <Sidebar onClose={handleCloseSidebar} />
        <div className="flex-1">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Create Anything</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CreationCard type="image" />
                <CreationCard type="storytelling" />
                <CreationCard type="image" />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStartItem 
                  title="Start a New Project" 
                  description="Begin your creative journey"
                  icon={<Rocket size={20} />} 
                  iconBg="bg-blue-500" 
                />
                <QuickStartItem 
                  title="Explore Templates" 
                  description="Find inspiration from our collection"
                  icon={<Search size={20} />} 
                  iconBg="bg-green-500" 
                />
                <QuickStartItem 
                  title="Join the Community" 
                  description="Connect with other creators"
                  icon={<Users size={20} />} 
                  iconBg="bg-purple-500" 
                />
                <QuickStartItem 
                  title="Read the Docs" 
                  description="Learn how to get started"
                  icon={<Book size={20} />} 
                  iconBg="bg-orange-500" 
                />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Featured Apps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeaturedAppCard
                  title="Design Editor"
                  subtitle="Edit designs with ease."
                  imageSrc="https://placehold.co/600x400"
                />
                <FeaturedAppCard
                  title="Code Generator"
                  subtitle="Generate code snippets quickly."
                  imageSrc="https://placehold.co/600x400"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Popular Models</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ModelCard
                  title="Model A"
                  subtitle="A powerful AI model."
                  imageSrc="https://placehold.co/400x300"
                />
                <ModelCard
                  title="Model B"
                  subtitle="An efficient AI model."
                  imageSrc="https://placehold.co/400x300"
                />
                <ModelCard
                  title="Model C"
                  subtitle="A versatile AI model."
                  imageSrc="https://placehold.co/400x300"
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
