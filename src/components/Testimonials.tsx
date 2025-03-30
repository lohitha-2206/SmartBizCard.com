
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const testimonials = [
  {
    name: "Michael Chang",
    role: "Startup Founder",
    content: "SmartBizCard helped me create professional-looking cards for my entire team in just minutes. The digital sharing feature has been a game changer at networking events.",
    avatar: "MC",
  },
  {
    name: "Jessica Williams",
    role: "Marketing Consultant",
    content: "I love how I can quickly update my card info and instantly share the latest version. The AI design suggestions matched my personal brand perfectly.",
    avatar: "JW",
  },
  {
    name: "Robert Chen",
    role: "Real Estate Agent",
    content: "My business is built on personal connections. Having a QR code on my printed cards that links to my digital profile has increased my follow-up conversions by 40%.",
    avatar: "RC",
  },
  {
    name: "Amanda Lopez",
    role: "Freelance Designer",
    content: "As a designer, I was skeptical, but the templates are beautiful and highly customizable. I've even recommended SmartBizCard to my own clients.",
    avatar: "AL",
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
            Join thousands of professionals who rely on SmartBizCard
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
