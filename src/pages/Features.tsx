
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Layers, Image, Download, Edit, Share2, CreditCard, Smartphone } from "lucide-react";

const Features = () => {
  const featuresList = [
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: "Custom Colors",
      description: "Personalize your business card with custom colors that match your brand identity."
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Multiple Templates",
      description: "Choose from a wide variety of professionally designed templates for any industry."
    },
    {
      icon: <Image className="h-10 w-10 text-primary" />,
      title: "Logo Upload",
      description: "Upload your company logo to create a truly personalized business card."
    },
    {
      icon: <Edit className="h-10 w-10 text-primary" />,
      title: "Font Customization",
      description: "Select from multiple fonts and sizes to create the perfect look for your text."
    },
    {
      icon: <Download className="h-10 w-10 text-primary" />,
      title: "Easy Export",
      description: "Export your business cards in high-resolution formats ready for printing."
    },
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: "Digital Sharing",
      description: "Share your business card digitally via email, social media, or QR code."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Print Services",
      description: "Order high-quality printed cards directly from our platform (coming soon)."
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Mobile Friendly",
      description: "Create and edit your business cards on any device, including smartphones."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-8 md:py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Features</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create stunning business cards with our powerful and easy-to-use platform. Explore all the features that make SmartBizCard the best choice for your business card needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuresList.map((feature, index) => (
              <Card key={index} className="border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
