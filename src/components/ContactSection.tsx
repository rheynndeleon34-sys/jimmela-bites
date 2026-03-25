import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const ContactSection = () => {
  const leftRef = useScrollReveal();
  const rightRef = useScrollReveal();

  return (
    <section id="contact" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto section-padding relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div ref={leftRef} className="opacity-0">
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">Contact Us</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-3 mb-5">
              Let's Talk Business
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-md">
              Whether you want to order in bulk, inquire about franchising, or just have questions — we'd love to hear from you.
            </p>

            <div className="space-y-5">
              {[
                { icon: Phone, label: "Phone", value: "+63 917 123 4567" },
                { icon: Mail, label: "Email", value: "orders@jimmelafood.ph" },
                { icon: MapPin, label: "Location", value: "Calumpit, Bulacan, Philippines" },
                { icon: Clock, label: "Hours", value: "Mon–Sat, 8:00 AM – 5:00 PM" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</span>
                    <p className="text-foreground text-sm font-medium mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={rightRef} className="opacity-0">
            <form className="bg-card rounded-3xl p-6 lg:p-8 shadow-lg shadow-foreground/5 border border-border" onSubmit={(e) => e.preventDefault()}>
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Send us a message</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      placeholder="Juan Dela Cruz"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      placeholder="juan@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
                    <option>Bulk Order Inquiry</option>
                    <option>Franchise Inquiry</option>
                    <option>General Question</option>
                    <option>Partnership Proposal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you need..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
