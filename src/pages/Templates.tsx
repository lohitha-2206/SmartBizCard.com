
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Lock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type BusinessCardTemplate = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  premium: boolean;
  front_design: {
    background: string;
    textColor: string;
    layout: string;
  };
  back_design: {
    background: string;
    textColor: string;
    layout: string;
  };
};

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Fetch templates from Supabase
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_card_templates")
        .select("*");
      
      if (error) throw error;
      return data as BusinessCardTemplate[];
    },
  });

  // Extract unique categories
  const categories = ["All", ...Array.from(
    new Set(templates?.map(template => template.category || "Other"))
  )];

  // Filter templates based on search and category
  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = searchTerm === "" || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading templates...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Templates</h2>
            <p className="text-muted-foreground mb-6">We encountered an issue loading the templates.</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  variant={category === selectedCategory ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates?.map((template) => (
              <div 
                key={template.id} 
                className="flex flex-col bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center business-card">
                    <div className="business-card-inner absolute inset-0">
                      <div 
                        className="business-card-front absolute inset-0 flex flex-col justify-between p-4 text-white"
                        style={{
                          background: template.front_design.background,
                          color: template.front_design.textColor
                        }}
                      >
                        <div>
                          <h3 className="text-sm font-bold">John Smith</h3>
                          <p className="text-xs font-medium">CEO & Founder</p>
                        </div>
                        <div>
                          <p className="text-xs">Example Company</p>
                          <p className="text-[10px] mt-1">www.example.com</p>
                        </div>
                      </div>
                      <div 
                        className="business-card-back absolute inset-0 flex flex-col justify-between p-4"
                        style={{
                          background: template.back_design.background,
                          color: template.back_design.textColor
                        }}
                      >
                        <div className="text-right">
                          <h3 className="text-sm font-bold">John Smith</h3>
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
                      {template.category || "Other"}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Link to={template.premium ? "/pricing" : `/editor?templateId=${template.id}`}>
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
