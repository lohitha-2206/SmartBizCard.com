
import { Check, Wand2, Share2, Download, Palette, QrCode } from "lucide-react";

const features = [
  {
    title: "Beautiful Templates",
    description: "Choose from dozens of professionally designed templates for any industry or personal style.",
    icon: <Palette className="h-6 w-6 text-primary" />,
  },
  {
    title: "AI-Powered Design",
    description: "Get personalized design suggestions based on your profession and preferences.",
    icon: <Wand2 className="h-6 w-6 text-primary" />,
  },
  {
    title: "Digital Sharing",
    description: "Share your digital business card via a custom URL, email, or social media with a single click.",
    icon: <Share2 className="h-6 w-6 text-primary" />,
  },
  {
    title: "QR Code Generation",
    description: "Generate a unique QR code for your business card that opens your digital profile when scanned.",
    icon: <QrCode className="h-6 w-6 text-primary" />,
  },
  {
    title: "Print-Ready Files",
    description: "Download high-resolution files ready for professional printing in multiple formats.",
    icon: <Download className="h-6 w-6 text-primary" />,
  },
  {
    title: "Premium Templates",
    description: "Access exclusive premium templates and features with a subscription or through referrals.",
    icon: <Check className="h-6 w-6 text-primary" />,
  },
];

const Features = () => {
  return (
    <section className="py-12 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful Features for Professionals
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
            Everything you need to create, share, and manage your business cards in one platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col p-6 bg-card shadow-sm rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
