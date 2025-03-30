
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const templates = [
  { id: 1, name: "Modern Minimalist", premium: false, category: "Professional" },
  { id: 2, name: "Creative Splash", premium: false, category: "Creative" },
  { id: 3, name: "Corporate Blue", premium: false, category: "Professional" },
  { id: 4, name: "Tech Innovator", premium: false, category: "Technology" },
  { id: 5, name: "Elegant Serif", premium: true, category: "Professional" },
  { id: 6, name: "Bold Gradient", premium: true, category: "Creative" },
  { id: 7, name: "Luxury Gold", premium: true, category: "Luxury" },
  { id: 8, name: "Artistic Portfolio", premium: true, category: "Creative" },
];

const categories = ["All", "Professional", "Creative", "Technology", "Luxury"];

const Templates = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-8 md:py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Business Card Templates</h1>
            <p className="text-muted-foreground text-lg">
              Choose from our collection of professionally designed templates.
              Customize colors, text, and layout to create your perfect business card.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search templates..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="flex gap-2 items-center">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category, index) => (
                <Badge 
                  key={index} 
                  variant={index === 0 ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="flex flex-col bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center business-card">
                    <div className="business-card-inner absolute inset-0">
                      <div className="business-card-front absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-br from-brand-pink/90 to-primary/90 text-white">
                        <div>
                          <h3 className="text-sm font-bold">John Smith</h3>
                          <p className="text-xs font-medium">CEO & Founder</p>
                        </div>
                        <div>
                          <p className="text-xs">Example Company</p>
                          <p className="text-[10px] mt-1">www.example.com</p>
                        </div>
                      </div>
                      <div className="business-card-back absolute inset-0 flex flex-col justify-between p-4 bg-white text-brand-dark">
                        <div className="text-right">
                          <h3 className="text-sm font-bold text-brand-pink">John Smith</h3>
                          <p className="text-xs">john@example.com</p>
                        </div>
                        <div>
                          <p className="text-xs">+1 (555) 123-4567</p>
                          <p className="text-[10px] mt-1">123 Business St, New York, NY</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {template.premium && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Link to={template.premium ? "/pricing" : "/editor"}>
                      <Button 
                        variant={template.premium ? "outline" : "default"} 
                        className="w-full"
                      >
                        {template.premium ? "Unlock Premium" : "Use This Template"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Templates;
