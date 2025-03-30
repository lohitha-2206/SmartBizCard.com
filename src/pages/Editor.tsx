
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, ArrowLeft, ChevronRight, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Type definitions for our business card data
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

type BusinessCardData = {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  templateId: string;
};

const Editor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("front");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [cardData, setCardData] = useState<BusinessCardData>({
    name: "My Business Card",
    firstName: "",
    lastName: "",
    title: "",
    companyName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    templateId: "",
  });

  // Fetch templates from Supabase
  const { data: templates, isLoading: isLoadingTemplates, error: templatesError } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_card_templates")
        .select("*");
      
      if (error) throw error;
      return data as BusinessCardTemplate[];
    },
  });

  // Extract template ID from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateId = params.get("templateId");
    
    if (templateId) {
      setSelectedTemplateId(templateId);
      setCardData(prev => ({ ...prev, templateId }));
    }
  }, [location]);

  // Get the current selected template
  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId) || templates?.[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const saveBusinessCard = async () => {
    if (!user) {
      toast.error("You must be logged in to save your business card.");
      navigate("/login");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Please select a template first.");
      return;
    }

    try {
      setIsSaving(true);
      
      const frontData = {
        firstName: cardData.firstName,
        lastName: cardData.lastName,
        title: cardData.title,
        companyName: cardData.companyName,
        design: selectedTemplate.front_design
      };
      
      const backData = {
        email: cardData.email,
        phone: cardData.phone,
        website: cardData.website,
        address: cardData.address,
        design: selectedTemplate.back_design
      };
      
      const { data, error } = await supabase
        .from("business_cards")
        .insert({
          user_id: user.id,
          name: cardData.name,
          template_id: selectedTemplate.id,
          front_data: frontData,
          back_data: backData
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Business card saved successfully!");
      // Navigate to the cards list or card details page
      // navigate(`/cards/${data.id}`);
    } catch (error: any) {
      console.error("Error saving business card:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingTemplates) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading editor...</span>
      </div>
    );
  }

  if (templatesError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Templates</h2>
          <p className="text-muted-foreground mb-4">
            We encountered an issue loading business card templates.
          </p>
          <Button onClick={() => navigate("/templates")}>
            Go Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container max-w-7xl">
          <div className="mb-6 flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2"
              onClick={() => navigate("/templates")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-3xl font-bold">Business Card Editor</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left side - Form */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Card Name</Label>
                      <Input
                        id="card-name"
                        name="name"
                        value={cardData.name}
                        onChange={handleInputChange}
                        placeholder="My Business Card"
                      />
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="front">Front Side</TabsTrigger>
                        <TabsTrigger value="back">Back Side</TabsTrigger>
                      </TabsList>

                      <TabsContent value="front" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={cardData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={cardData.lastName}
                            onChange={handleInputChange}
                            placeholder="Smith"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={cardData.title}
                            onChange={handleInputChange}
                            placeholder="CEO & Founder"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={cardData.companyName}
                            onChange={handleInputChange}
                            placeholder="Example Company"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="back" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={cardData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={cardData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={cardData.website}
                            onChange={handleInputChange}
                            placeholder="www.example.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            name="address"
                            value={cardData.address}
                            onChange={handleInputChange}
                            placeholder="123 Business St, New York, NY"
                            rows={3}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1" 
                  onClick={saveBusinessCard}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Card
                    </>
                  )}
                </Button>
                
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            {/* Right side - Card Preview */}
            <div className="md:col-span-2">
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">
                  {activeTab === "front" ? "Front Side Preview" : "Back Side Preview"}
                </h2>
                
                <div className="w-full max-w-md aspect-[1.75/1] mb-6">
                  <div className="business-card rounded-md shadow-lg overflow-hidden h-full">
                    {activeTab === "front" ? (
                      <div 
                        className="h-full p-6 flex flex-col justify-between"
                        style={{
                          background: selectedTemplate?.front_design.background || "#ffffff",
                          color: selectedTemplate?.front_design.textColor || "#000000"
                        }}
                      >
                        <div>
                          <h3 className="text-xl font-bold">
                            {cardData.firstName || "First"} {cardData.lastName || "Last"}
                          </h3>
                          <p className="text-sm font-medium mt-1">
                            {cardData.title || "Job Title"}
                          </p>
                        </div>
                        <div>
                          <p className="text-base">{cardData.companyName || "Company Name"}</p>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="h-full p-6 flex flex-col justify-between"
                        style={{
                          background: selectedTemplate?.back_design.background || "#f8f8f8",
                          color: selectedTemplate?.back_design.textColor || "#333333"
                        }}
                      >
                        <div className="text-right">
                          <h3 className="font-bold">Contact</h3>
                          <p className="text-sm">{cardData.email || "email@example.com"}</p>
                          <p className="text-sm">{cardData.phone || "+1 (555) 123-4567"}</p>
                          <p className="text-sm">{cardData.website || "www.example.com"}</p>
                        </div>
                        <div>
                          <p className="text-xs">{cardData.address || "123 Business St, New York, NY"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <h3 className="font-medium mb-2">Selected Template: {selectedTemplate?.name || "None"}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {templates?.map((template) => (
                      <div 
                        key={template.id}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${selectedTemplate?.id === template.id ? "border-primary" : "border-transparent hover:border-muted"}`}
                        onClick={() => {
                          setSelectedTemplateId(template.id);
                          setCardData(prev => ({ ...prev, templateId: template.id }));
                        }}
                      >
                        <div 
                          className="h-16 p-2 text-xs"
                          style={{
                            background: template.front_design.background,
                            color: template.front_design.textColor
                          }}
                        >
                          {template.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Editor;
