
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit, Download, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

type BusinessCard = {
  id: string;
  name: string;
  user_id: string;
  template_id: string;
  front_data: {
    firstName: string;
    lastName: string;
    title: string;
    companyName: string;
    design: {
      background: string;
      textColor: string;
      layout: string;
    };
  };
  back_data: {
    email: string;
    phone: string;
    website: string;
    address: string;
    design: {
      background: string;
      textColor: string;
      layout: string;
    };
  };
  created_at: string;
  updated_at: string;
};

const MyCards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: cards, isLoading, error } = useQuery({
    queryKey: ["businessCards"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("business_cards")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      // Cast the data to the correct type to handle the JSON fields
      return (data as any[]).map(item => ({
        ...item,
        front_data: item.front_data as BusinessCard["front_data"],
        back_data: item.back_data as BusinessCard["back_data"]
      })) as BusinessCard[];
    },
    enabled: !!user,
  });

  const handleDeleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from("business_cards")
        .delete()
        .eq("id", cardId);
      
      if (error) throw error;
      
      toast.success("Business card deleted successfully");
      // Refetch the cards list
      navigate(0);
    } catch (error: any) {
      console.error("Error deleting card:", error);
      toast.error(`Failed to delete: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading your cards...</span>
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
            <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Cards</h2>
            <p className="text-muted-foreground mb-6">We encountered an issue loading your business cards.</p>
            <Button onClick={() => navigate(0)}>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">My Business Cards</h1>
            <Button onClick={() => navigate("/templates")} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create New Card
            </Button>
          </div>

          {cards && cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card key={card.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <div className="h-48 relative">
                    <div 
                      className="absolute inset-0 p-4 flex flex-col justify-between"
                      style={{
                        background: card.front_data.design.background,
                        color: card.front_data.design.textColor
                      }}
                    >
                      <div>
                        <h3 className="text-lg font-bold">
                          {card.front_data.firstName} {card.front_data.lastName}
                        </h3>
                        <p className="text-sm">{card.front_data.title}</p>
                      </div>
                      <div>
                        <p className="text-sm">{card.front_data.companyName}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{card.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Created: {new Date(card.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() => navigate(`/editor?cardId=${card.id}`)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center justify-center text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-muted/20">
              <h2 className="text-xl font-semibold mb-3">No Business Cards Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't created any business cards yet. Create your first card to get started.
              </p>
              <Button onClick={() => navigate("/templates")}>
                Browse Templates
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyCards;
