
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, HelpCircle } from "lucide-react";

type TourStep = {
  title: string;
  description: string;
  image?: string;
};

interface PageTourProps {
  pageName: string;
}

const PageTour = ({ pageName }: PageTourProps) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  useEffect(() => {
    // Define different tour steps based on the page
    if (pageName === "messaging") {
      setSteps([
        {
          title: "Welcome to SecureText Messaging",
          description: "This tour will guide you through our secure messaging features.",
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&h=300"
        },
        {
          title: "User Selection",
          description: "Search for users or select someone from your contacts to start a conversation.",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=300"
        },
        {
          title: "Encryption Settings",
          description: "Choose an encryption algorithm and set a password to secure your messages.",
          image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=300"
        },
        {
          title: "Message History",
          description: "View your conversation history and copy encrypted messages as needed.",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=300"
        },
        {
          title: "Adding Contacts",
          description: "Use the Find User button to search for contacts by their unique code.",
          image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&h=300"
        }
      ]);
    } else if (pageName === "profile") {
      // Profile page tour steps
      setSteps([
        {
          title: "Your Profile",
          description: "Manage your account settings and security preferences here.",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=300"
        },
        {
          title: "Security Settings",
          description: "Control how your messages are handled after viewing.",
          image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=600&h=300"
        },
        {
          title: "Your Unique Code",
          description: "Share this code with friends so they can find and connect with you.",
          image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&h=300"
        }
      ]);
    }
  }, [pageName]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStep(0);
  };

  // Show tour button only if there are steps defined
  if (steps.length === 0) return null;

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg z-50 bg-primary text-primary-foreground"
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
      
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{steps[currentStep]?.title}</DialogTitle>
            <DialogDescription>
              {steps[currentStep]?.description}
            </DialogDescription>
          </DialogHeader>
          
          {steps[currentStep]?.image && (
            <div className="py-4 flex justify-center">
              <img 
                src={steps[currentStep].image} 
                alt={steps[currentStep].title} 
                className="rounded-lg max-h-[250px] object-cover w-full"
              />
            </div>
          )}
          
          <div className="flex items-center justify-center mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button 
              variant="ghost"
              onClick={handleClose}
            >
              <X className="mr-2 h-4 w-4" />
              Skip
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep < steps.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PageTour;
