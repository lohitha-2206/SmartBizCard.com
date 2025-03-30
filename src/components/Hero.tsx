
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 overflow-hidden">
      <div className="container flex flex-col items-center gap-4 text-center">
        <div className="space-y-2">
          <h1 className="animate-fade-in text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-primary">
            Create Professional Business Cards in Minutes
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-fade-in animation-delay-100">
            Design, customize and share digital business cards. Get print-ready files for physical cards. Powered by AI.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Link to="/signup">
            <Button size="lg" className="gap-1">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/templates">
            <Button size="lg" variant="outline">
              Explore Templates
            </Button>
          </Link>
        </div>
      </div>
      <div className="container mt-16 md:mt-24 lg:mt-28 relative">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-lg border bg-card shadow-xl animate-slide-up">
          <div className="relative p-4 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="business-card group relative overflow-hidden rounded-lg shadow-md">
                  <div className="business-card-inner absolute inset-0">
                    <div className="business-card-front absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-brand-pink/90 to-primary/90 text-white">
                      <div>
                        <h3 className="text-lg font-bold">Sarah Johnson</h3>
                        <p className="text-sm font-medium">Marketing Director</p>
                      </div>
                      <div>
                        <p className="text-sm">Creative Solutions Inc.</p>
                        <p className="text-xs mt-1">www.creativesolutions.com</p>
                      </div>
                    </div>
                    <div className="business-card-back absolute inset-0 flex flex-col justify-between p-6 bg-white text-brand-dark">
                      <div className="text-right">
                        <h3 className="text-lg font-bold text-brand-pink">Sarah Johnson</h3>
                        <p className="text-sm">sarah@creativesolutions.com</p>
                      </div>
                      <div>
                        <p className="text-sm">+1 (555) 123-4567</p>
                        <p className="text-xs mt-1">123 Business Ave, Suite 200, San Francisco, CA</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
