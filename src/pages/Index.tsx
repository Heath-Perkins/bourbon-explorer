import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BourbonCard } from "@/components/BourbonCard";
import { bourbons } from "@/data/bourbons";

const features = [
  {
    icon: Search,
    title: "Discover",
    description: "Explore our comprehensive catalog of bourbons from legendary distilleries across Kentucky and beyond."
  },
  {
    icon: BookOpen,
    title: "Document",
    description: "Keep detailed tasting notes with our elegant diary. Track colors, aromas, flavors, and your personal ratings."
  },
  {
    icon: Share2,
    title: "Share",
    description: "Share your bourbon experiences and recommendations with fellow enthusiasts around the world."
  }
];

export default function Index() {
  const featuredBourbons = bourbons.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight opacity-0 animate-fade-up">
              Your Personal
              <span className="block text-gradient">Bourbon Journey</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto opacity-0 animate-fade-up stagger-1">
              Discover the rich heritage of America's native spirit. Explore, taste, and document 
              your bourbon experiences with our comprehensive tasting journal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-up stagger-2">
              <Link to="/catalog">
                <Button variant="hero" size="xl">
                  Explore Bourbons
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/diary">
                <Button variant="glass" size="xl">
                  Start Tasting Diary
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Your Complete Bourbon Companion
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a seasoned connoisseur or just beginning your bourbon journey, 
              Bourbon Vault is your trusted guide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="text-center p-8 rounded-2xl bg-secondary/30 border border-border/50 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-bourbon-amber/10 text-bourbon-amber mb-6">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Bourbons Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">Featured Bourbons</h2>
              <p className="text-muted-foreground">Explore some of our most celebrated selections</p>
            </div>
            <Link to="/catalog">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBourbons.map((bourbon, index) => (
              <BourbonCard key={bourbon.id} bourbon={bourbon} index={index} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/catalog">
              <Button variant="outline">
                View All Bourbons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                The Spirit of America
              </h2>
              <p className="text-muted-foreground">
                A brief history of bourbon whiskey
              </p>
            </div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Bourbon's origins trace back to the late 18th century in Kentucky, where Scottish, 
                Irish, and German immigrants brought their distilling traditions to the New World. 
                Named after Bourbon County—itself named for the French royal family—this distinctly 
                American spirit must be made from at least 51% corn and aged in new charred oak barrels.
              </p>
              <p className="text-lg leading-relaxed mt-4">
                By 1964, Congress declared bourbon "America's Native Spirit," protecting its heritage 
                and production standards. Today, over 95% of the world's bourbon is produced in Kentucky, 
                where limestone-filtered water and generations of craftsmanship create the complex, 
                caramel-rich spirit beloved worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-xl font-semibold mb-2">Bourbon Vault</p>
          <p className="text-sm text-accent-foreground/70">
            Your personal bourbon journey companion
          </p>
          <p className="text-xs text-accent-foreground/50 mt-6">
            Please drink responsibly. Must be 21+ to consume alcohol.
          </p>
        </div>
      </footer>
    </div>
  );
}
