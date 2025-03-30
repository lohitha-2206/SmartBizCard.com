
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Lock, Loader2, Palette, Type } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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
  created_at: string;
  updated_at: string;
};

// Additional template designs to add variety
const additionalTemplates = [
  {
    name: "Forest Green",
    description: "Earthy green tones for eco-friendly businesses",
    category: "Nature",
    premium: false,
    front_design: {
      background: "#2d6a4f",
      textColor: "#ffffff",
      layout: "nature"
    },
    back_design: {
      background: "#b7e4c7",
      textColor: "#2d6a4f",
      layout: "eco-friendly"
    }
  },
  {
    name: "Sunset Orange",
    description: "Warm sunset colors for creative professionals",
    category: "Creative",
    premium: false,
    front_design: {
      background: "linear-gradient(135deg, #ff9e00, #ff4e00)",
      textColor: "#ffffff",
      layout: "sunset"
    },
    back_design: {
      background: "#ffffff",
      textColor: "#ff4e00",
      layout: "warm-contacts"
    }
  },
  {
    name: "Ocean Blue",
    description: "Calming ocean blues for water-related businesses",
    category: "Nature",
    premium: false,
    front_design: {
      background: "linear-gradient(135deg, #0077b6, #00b4d8)",
      textColor: "#ffffff",
      layout: "waves"
    },
    back_design: {
      background: "#caf0f8",
      textColor: "#0077b6",
      layout: "ocean-grid"
    }
  },
  {
    name: "Neon Nights",
    description: "Bold neon colors for nightlife and entertainment",
    category: "Entertainment",
    premium: true,
    front_design: {
      background: "#0d0221",
      textColor: "#fe53bb",
      layout: "neon"
    },
    back_design: {
      background: "#190635",
      textColor: "#34ebd2",
      layout: "nightlife"
    }
  },
  {
    name: "Vintage Cream",
    description: "Classic vintage look for traditional businesses",
    category: "Classic",
    premium: false,
    front_design: {
      background: "#f5ebe0",
      textColor: "#7f5539",
      layout: "vintage"
    },
    back_design: {
      background: "#e6ccb2",
      textColor: "#7f5539",
      layout: "retro-contact"
    }
  },
  {
    name: "Monochrome Bold",
    description: "Bold black and white design for modern professionals",
    category: "Professional",
    premium: false,
    front_design: {
      background: "#000000",
      textColor: "#ffffff",
      layout: "monochrome"
    },
    back_design: {
      background: "#ffffff",
      textColor: "#000000",
      layout: "bold-grid"
    }
  },
  {
    name: "Pastel Dreams",
    description: "Soft pastel colors for creative businesses",
    category: "Creative",
    premium: true,
    front_design: {
      background: "linear-gradient(135deg, #ffd6ff, #c8b6ff)",
      textColor: "#6247aa",
      layout: "pastel"
    },
    back_design: {
      background: "#ffffff",
      textColor: "#6247aa",
      layout: "soft-contacts"
    }
  },
  {
    name: "Tech Minimal",
    description: "Clean minimal design for tech startups",
    category: "Technology",
    premium: true,
    front_design: {
      background: "#f8f9fa",
      textColor: "#212529",
      layout: "tech-minimal"
    },
    back_design: {
      background: "#e9ecef",
      textColor: "#212529",
      layout: "startup-grid"
    }
  }
];

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "detail"
  const [previewSide, setPreviewSide] = useState("front"); // "front" or "back"
  
  // Fetch templates from Supabase
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_card_templates")
        .select("*");
      
      if (error) throw error;
      
      // If we have less than 12 templates in the database, add our additional ones
      let processedData = (data as any[]).map(item => ({
        ...item,
        front_design: item.front_design as BusinessCardTemplate["front_design"],
        back_design: item.back_design as BusinessCardTemplate["back_design"]
      })) as BusinessCardTemplate[];
      
      // In a real app, we would insert these into the database
      // For now, we'll just add them to the results if we have less than 12 templates
      if (processedData.length < 12) {
        // Add additional templates to the database via the client
        // In a real app, we would do this via SQL or admin function
        additionalTemplates.forEach(async (template) => {
          await supabase
            .from("business_card_templates")
            .insert([template]);
        });
        
        // Add them to our processed data for immediate display
        const additionalProcessed = additionalTemplates.map((template, index) => ({
          ...template,
          id: `additional-${index}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        processedData = [...processedData, ...additionalProcessed];
      }
      
      return processedData;
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

  // Function to handle click on flipping the card preview
  const togglePreviewSide = () => {
    setPreviewSide(previewSide === "front" ? "back" : "front");
  };

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
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex gap-2 items-center">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="detail">Detail</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
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
          
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates?.map((template) => (
                <div 
                  key={template.id} 
                  className="flex flex-col bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="business-card-inner absolute inset-0" onClick={togglePreviewSide}>
                        {previewSide === "front" ? (
                          <div 
                            className="business-card-front absolute inset-0 flex flex-col justify-between p-4 cursor-pointer"
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
                            <div className="absolute top-2 right-2 bg-black/20 text-white text-xs px-2 py-1 rounded">
                              Click to flip
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="business-card-back absolute inset-0 flex flex-col justify-between p-4 cursor-pointer"
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
                            <div className="absolute top-2 right-2 bg-black/20 text-white text-xs px-2 py-1 rounded">
                              Click to flip
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {template.premium && (
                      <div className="absolute top-2 left-2">
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
                    {template.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.description}
                      </p>
                    )}
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
          ) : (
            <div className="space-y-8">
              {filteredTemplates?.map((template) => (
                <div 
                  key={template.id} 
                  className="flex flex-col md:flex-row bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full md:w-96 h-64">
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div
                        className="business-card w-full h-full rounded flex flex-col justify-between p-4 cursor-pointer"
                        style={{
                          background: previewSide === "front" ? template.front_design.background : template.back_design.background,
                          color: previewSide === "front" ? template.front_design.textColor : template.back_design.textColor
                        }}
                        onClick={togglePreviewSide}
                      >
                        {previewSide === "front" ? (
                          <>
                            <div>
                              <h3 className="text-lg font-bold">John Smith</h3>
                              <p className="text-sm font-medium">CEO & Founder</p>
                            </div>
                            <div>
                              <p className="text-sm">Example Company</p>
                              <p className="text-xs mt-1">www.example.com</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-right">
                              <h3 className="text-lg font-bold">John Smith</h3>
                              <p className="text-sm">john@example.com</p>
                            </div>
                            <div>
                              <p className="text-sm">+1 (555) 123-4567</p>
                              <p className="text-xs mt-1">123 Business St, New York, NY</p>
                            </div>
                          </>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/20 text-white text-xs px-2 py-1 rounded">
                          {previewSide === "front" ? "Click to see back" : "Click to see front"}
                        </div>
                      </div>
                    </div>
                    {template.premium && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Premium
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold">{template.name}</h3>
                      <Badge variant="outline">
                        {template.category || "Other"}
                      </Badge>
                    </div>
                    
                    {template.description && (
                      <p className="text-muted-foreground mb-4">
                        {template.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="border rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Palette className="h-4 w-4 text-primary" />
                          <span className="font-medium">Colors</span>
                        </div>
                        <div className="flex gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border" 
                            style={{ background: template.front_design.background }}
                            title="Front background"
                          ></div>
                          <div 
                            className="w-6 h-6 rounded-full border" 
                            style={{ background: template.front_design.textColor }}
                            title="Front text color"
                          ></div>
                          <div 
                            className="w-6 h-6 rounded-full border" 
                            style={{ background: template.back_design.background }}
                            title="Back background"
                          ></div>
                          <div 
                            className="w-6 h-6 rounded-full border" 
                            style={{ background: template.back_design.textColor }}
                            title="Back text color"
                          ></div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Type className="h-4 w-4 text-primary" />
                          <span className="font-medium">Layout</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {template.front_design.layout}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.back_design.layout}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Link to={template.premium ? "/pricing" : `/editor?templateId=${template.id}`}>
                      <Button 
                        variant={template.premium ? "outline" : "default"} 
                        className="w-full md:w-auto"
                      >
                        {template.premium ? "Unlock Premium" : "Use This Template"}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Templates;
