
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Privacy Advocate",
      content: "SecureText gives me the peace of mind I need when communicating sensitive information. The encryption is top-notch.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content: "We use SecureText for all our internal communications. It's secure, reliable, and easy to use.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Journalist",
      content: "As a journalist, protecting my sources is crucial. SecureText provides the security I need without compromising usability.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of satisfied users who trust SecureText for their secure communications.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
