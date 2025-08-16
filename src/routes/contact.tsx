import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ContactPage = () => {
  return (
    <Container>
      <div className="py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in touch</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600">support@aimockinterview.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday: 10:00 AM - 2:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Response Time</h3>
                  <p className="text-gray-600">
                    We typically respond to inquiries within 24 hours during business days.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Support</h3>
                  <p className="text-gray-600">
                    For technical support or account issues, please include your user ID and a detailed description of the problem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
