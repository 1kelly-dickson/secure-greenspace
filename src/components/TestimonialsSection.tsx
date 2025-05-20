
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Software Developer',
    content: 'Finally, a secure messaging app that doesn\'t compromise on usability. I use this daily for all my sensitive communications with clients.',
    avatar: 'https://avatar.vercel.sh/alex',
    rating: 5,
  },
  {
    name: 'Maria Garcia',
    role: 'Privacy Advocate',
    content: 'The encryption tools offered here have been a game-changer for my organization. We can confidently share sensitive documents knowing they\'re protected.',
    avatar: 'https://avatar.vercel.sh/maria',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'IT Security Specialist',
    content: 'After testing numerous security solutions, this platform stands out for its robust encryption and intuitive interface. Highly recommended for teams.',
    avatar: 'https://avatar.vercel.sh/david',
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it - see what our users have to say about our secure communication platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl bg-gradient-to-br from-card to-background border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex mb-4 items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'fill-primary text-primary' : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-muted-foreground">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
