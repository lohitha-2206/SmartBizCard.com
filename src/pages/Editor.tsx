
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
import { Slider } from "@/components/ui/slider";
import { 
  Loader2, Save, ArrowLeft, ChevronRight, Download, Palette, Type, 
  LayoutGrid, CircleDot, Undo, Redo
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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
  created_at: string;
  updated_at: string;
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
  customization: {
    frontBackground: string;
    frontTextColor: string;
    backBackground: string;
    backTextColor: string;
    fontSize: {
      name: number;
      title: number;
      details: number;
    };
  };
};

// Font size presets
const fontSizeOptions = {
  nameMin: 16,
  nameMax: 36,
  titleMin: 12,
  titleMax: 24,
  detailsMin: 10,
  detailsMax: 20
};

// Color presets
const colorPresets = [
  { name: "Black & White", front: "#000000", frontText: "#ffffff", back: "#ffffff", backText: "#000000" },
  { name: "Blue Professional", front: "#1e3a8a", frontText: "#ffffff", back: "#ffffff", backText: "#1e3a8a" },
  { name: "Earthy Green", front: "#2d6a4f", frontText: "#ffffff", back: "#b7e4c7", backText: "#2d6a4f" },
  { name: "Vibrant Red", front: "#e63946", frontText: "#ffffff", back: "#f1faee", backText: "#e63946" },
  { name: "Sunset Orange", front: "linear-gradient(135deg, #ff9e00, #ff4e00)", frontText: "#ffffff", back: "#ffffff", backText: "#ff4e00" },
  { name: "Pastel Pink", front: "#ffafcc", frontText: "#590d22", back: "#ffeae0", backText: "#590d22" },
  { name: "Dark Mode", front: "#121212", frontText: "#e0e0e0", back: "#1f1f1f", backText: "#e0e0e0" },
  { name: "Forest Tones", front: "#344e41", frontText: "#dad7cd", back: "#a3b18a", backText: "#344e41" }
];

const Editor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("front");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<"content" | "design">("content");
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
    customization: {
      frontBackground: "",
      frontTextColor: "",
      backBackground: "",
      backTextColor: "",
      fontSize: {
        name: 24,
        title: 16,
        details: 12
      }
    }
  });

  // Fetch templates from Supabase
  const { data: templates, isLoading: isLoadingTemplates, error: templatesError } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_card_templates")
        .select("*");
      
      if (error) throw error;
      // Cast the data to the correct type to handle the JSON fields
      return (data as any[]).map(item => ({
        ...item,
        front_design: item.front_design as BusinessCardTemplate["front_design"],
        back_design: item.back_design as BusinessCardTemplate["back_design"]
      })) as BusinessCardTemplate[];
    },
  });

  // Fetch existing card if cardId is present
  const { data: existingCard, isLoading: isLoadingCard } = useQuery({
    queryKey: ["businessCard", location.search],
    queryFn: async () => {
      const params = new URLSearchParams(location.search);
      const cardId = params.get("cardId");
      
      if (!cardId || !user) return null;
      
      const { data, error } = await supabase
        .from("business_cards")
        .select("*")
        .eq("id", cardId)
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        if (error.code === "PGRST116") return null; // No rows returned
        throw error;
      }
      
      return data;
    },
    enabled: !!user && !!location.search.includes("cardId")
  });

  // Extract template ID or card ID from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateId = params.get("templateId");
    
    if (templateId) {
      setSelectedTemplateId(templateId);
      setCardData(prev => ({ 
        ...prev, 
        templateId 
      }));
    }
  }, [location]);

  // Update card data with existing card data if available
  useEffect(() => {
    if (existingCard && templates) {
      const template = templates.find(t => t.id === existingCard.template_id);
      
      if (template) {
        setSelectedTemplateId(template.id);
        
        // Cast to proper types
        const frontData = existingCard.front_data as any;
        const backData = existingCard.back_data as any;
        
        // Check if custom colors were saved
        const customFrontBackground = frontData.customBackground || template.front_design.background;
        const customFrontTextColor = frontData.customTextColor || template.front_design.textColor;
        const customBackBackground = backData.customBackground || template.back_design.background;
        const customBackTextColor = backData.customTextColor || template.back_design.textColor;
        
        // Check if custom font sizes were saved
        const customFontSizes = {
          name: frontData.fontSize?.name || 24,
          title: frontData.fontSize?.title || 16,
          details: frontData.fontSize?.details || 12
        };
        
        setCardData({
          name: existingCard.name,
          firstName: frontData.firstName || "",
          lastName: frontData.lastName || "",
          title: frontData.title || "",
          companyName: frontData.companyName || "",
          email: backData.email || "",
          phone: backData.phone || "",
          website: backData.website || "",
          address: backData.address || "",
          templateId: template.id,
          customization: {
            frontBackground: customFrontBackground,
            frontTextColor: customFrontTextColor,
            backBackground: customBackBackground,
            backTextColor: customBackTextColor,
            fontSize: customFontSizes
          }
        });
      }
    }
  }, [existingCard, templates]);

  // Initialize customization colors from selected template
  useEffect(() => {
    if (selectedTemplateId && templates) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template && !cardData.customization.frontBackground) {
        setCardData(prev => ({
          ...prev,
          customization: {
            ...prev.customization,
            frontBackground: template.front_design.background,
            frontTextColor: template.front_design.textColor,
            backBackground: template.back_design.background,
            backTextColor: template.back_design.textColor
          }
        }));
      }
    }
  }, [selectedTemplateId, templates]);

  // Get the current selected template
  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId) || templates?.[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomizationChange = (type: keyof BusinessCardData["customization"], value: string | number | object) => {
    setCardData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        [type]: value
      }
    }));
  };

  const handleFontSizeChange = (type: keyof BusinessCardData["customization"]["fontSize"], value: number[]) => {
    setCardData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        fontSize: {
          ...prev.customization.fontSize,
          [type]: value[0]
        }
      }
    }));
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setCardData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        frontBackground: preset.front,
        frontTextColor: preset.frontText,
        backBackground: preset.back,
        backTextColor: preset.backText
      }
    }));
    toast.success(`Applied color preset: ${preset.name}`);
  };

  const resetToTemplateDefaults = () => {
    if (selectedTemplate) {
      setCardData(prev => ({
        ...prev,
        customization: {
          ...prev.customization,
          frontBackground: selectedTemplate.front_design.background,
          frontTextColor: selectedTemplate.front_design.textColor,
          backBackground: selectedTemplate.back_design.background,
          backTextColor: selectedTemplate.back_design.textColor,
          fontSize: {
            name: 24,
            title: 16,
            details: 12
          }
        }
      }));
      toast.success("Reset to template defaults");
    }
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
        design: selectedTemplate.front_design,
        customBackground: cardData.customization.frontBackground,
        customTextColor: cardData.customization.frontTextColor,
        fontSize: cardData.customization.fontSize
      };
      
      const backData = {
        email: cardData.email,
        phone: cardData.phone,
        website: cardData.website,
        address: cardData.address,
        design: selectedTemplate.back_design,
        customBackground: cardData.customization.backBackground,
        customTextColor: cardData.customization.backTextColor
      };
      
      const params = new URLSearchParams(location.search);
      const cardId = params.get("cardId");
      
      let result;
      
      if (cardId) {
        // Update existing card
        result = await supabase
          .from("business_cards")
          .update({
            name: cardData.name,
            template_id: selectedTemplate.id,
            front_data: frontData,
            back_data: backData,
            updated_at: new Date().toISOString()
          })
          .eq("id", cardId)
          .eq("user_id", user.id)
          .select()
          .single();
        
        if (result.error) throw result.error;
        toast.success("Business card updated successfully!");
      } else {
        // Create new card
        result = await supabase
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
        
        if (result.error) throw result.error;
        toast.success("Business card saved successfully!");
      }
      
      // Navigate to the card details page
      navigate(`/my-cards`);
    } catch (error: any) {
      console.error("Error saving business card:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingTemplates || isLoadingCard) {
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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
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
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditMode("content")}
                className={editMode === "content" ? "bg-primary/10" : ""}
              >
                <Type className="h-4 w-4 mr-1" /> Content
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditMode("design")}
                className={editMode === "design" ? "bg-primary/10" : ""}
              >
                <Palette className="h-4 w-4 mr-1" /> Design
              </Button>
            </div>
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

                      {editMode === "content" ? (
                        <>
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
                        </>
                      ) : (
                        <>
                          <TabsContent value="front" className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="frontBackground">Background Color</Label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-10 h-10 rounded border cursor-pointer"
                                  style={{ background: cardData.customization.frontBackground }}
                                ></div>
                                <Input
                                  id="frontBackground"
                                  value={cardData.customization.frontBackground}
                                  onChange={(e) => handleCustomizationChange("frontBackground", e.target.value)}
                                  placeholder="#000000 or linear-gradient(...)"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="frontTextColor">Text Color</Label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-10 h-10 rounded border cursor-pointer"
                                  style={{ background: cardData.customization.frontTextColor }}
                                ></div>
                                <Input
                                  id="frontTextColor"
                                  value={cardData.customization.frontTextColor}
                                  onChange={(e) => handleCustomizationChange("frontTextColor", e.target.value)}
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Name Font Size: {cardData.customization.fontSize.name}px</Label>
                              <Slider 
                                defaultValue={[cardData.customization.fontSize.name]} 
                                max={fontSizeOptions.nameMax} 
                                min={fontSizeOptions.nameMin}
                                step={1}
                                onValueChange={(value) => handleFontSizeChange("name", value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Title Font Size: {cardData.customization.fontSize.title}px</Label>
                              <Slider 
                                defaultValue={[cardData.customization.fontSize.title]} 
                                max={fontSizeOptions.titleMax} 
                                min={fontSizeOptions.titleMin}
                                step={1}
                                onValueChange={(value) => handleFontSizeChange("title", value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Details Font Size: {cardData.customization.fontSize.details}px</Label>
                              <Slider 
                                defaultValue={[cardData.customization.fontSize.details]} 
                                max={fontSizeOptions.detailsMax} 
                                min={fontSizeOptions.detailsMin}
                                step={1}
                                onValueChange={(value) => handleFontSizeChange("details", value)}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="back" className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="backBackground">Background Color</Label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-10 h-10 rounded border cursor-pointer"
                                  style={{ background: cardData.customization.backBackground }}
                                ></div>
                                <Input
                                  id="backBackground"
                                  value={cardData.customization.backBackground}
                                  onChange={(e) => handleCustomizationChange("backBackground", e.target.value)}
                                  placeholder="#ffffff or linear-gradient(...)"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="backTextColor">Text Color</Label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-10 h-10 rounded border cursor-pointer"
                                  style={{ background: cardData.customization.backTextColor }}
                                ></div>
                                <Input
                                  id="backTextColor"
                                  value={cardData.customization.backTextColor}
                                  onChange={(e) => handleCustomizationChange("backTextColor", e.target.value)}
                                  placeholder="#000000"
                                />
                              </div>
                            </div>
                          </TabsContent>
                        </>
                      )}
                    </Tabs>
                    
                    {editMode === "design" && (
                      <div className="mt-4 pt-4 border-t">
                        <Label className="mb-2 block">Color Presets</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {colorPresets.map((preset, index) => (
                            <div 
                              key={index}
                              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => applyColorPreset(preset)}
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden border shadow-sm mb-1">
                                <div className="w-full h-1/2" style={{ background: preset.front }}></div>
                                <div className="w-full h-1/2" style={{ background: preset.back }}></div>
                              </div>
                              <span className="text-xs text-center">{preset.name.split(" ")[0]}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={resetToTemplateDefaults}
                            className="flex items-center gap-1"
                          >
                            <Undo className="h-3.5 w-3.5" />
                            Reset to Default
                          </Button>
                        </div>
                      </div>
                    )}
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
                          background: cardData.customization.frontBackground || selectedTemplate?.front_design.background || "#ffffff",
                          color: cardData.customization.frontTextColor || selectedTemplate?.front_design.textColor || "#000000"
                        }}
                      >
                        <div>
                          <h3 style={{ fontSize: `${cardData.customization.fontSize.name}px` }} className="font-bold">
                            {cardData.firstName || "First"} {cardData.lastName || "Last"}
                          </h3>
                          <p style={{ fontSize: `${cardData.customization.fontSize.title}px` }} className="font-medium mt-1">
                            {cardData.title || "Job Title"}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: `${cardData.customization.fontSize.details}px` }}>
                            {cardData.companyName || "Company Name"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="h-full p-6 flex flex-col justify-between"
                        style={{
                          background: cardData.customization.backBackground || selectedTemplate?.back_design.background || "#f8f8f8",
                          color: cardData.customization.backTextColor || selectedTemplate?.back_design.textColor || "#333333"
                        }}
                      >
                        <div className="text-right">
                          <h3 style={{ fontSize: `${cardData.customization.fontSize.name}px` }} className="font-bold">Contact</h3>
                          <p style={{ fontSize: `${cardData.customization.fontSize.details}px` }}>{cardData.email || "email@example.com"}</p>
                          <p style={{ fontSize: `${cardData.customization.fontSize.details}px` }}>{cardData.phone || "+1 (555) 123-4567"}</p>
                          <p style={{ fontSize: `${cardData.customization.fontSize.details}px` }}>{cardData.website || "www.example.com"}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: `${cardData.customization.fontSize.details}px` }}>
                            {cardData.address || "123 Business St, New York, NY"}
                          </p>
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
                          setCardData(prev => ({ 
                            ...prev, 
                            templateId: template.id,
                            customization: {
                              ...prev.customization,
                              frontBackground: template.front_design.background,
                              frontTextColor: template.front_design.textColor,
                              backBackground: template.back_design.background,
                              backTextColor: template.back_design.textColor
                            }
                          }));
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
