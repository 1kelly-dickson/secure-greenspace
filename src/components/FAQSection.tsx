
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "How secure is SecureText?",
      answer: "SecureText uses end-to-end encryption, meaning your messages are encrypted on your device before being sent and can only be decrypted by the intended recipient. We use industry-standard encryption protocols to ensure maximum security."
    },
    {
      question: "Can I use SecureText on multiple devices?",
      answer: "Yes, you can use SecureText on multiple devices. Your account will sync across all your devices while maintaining the same level of security and encryption."
    },
    {
      question: "Is there a limit to message size?",
      answer: "Free accounts can send messages up to 10MB, while Pro accounts have no size limits for messages and file attachments."
    },
    {
      question: "How do I add contacts?",
      answer: "You can add contacts by searching for their username or email address in the 'Add Contact' feature from your dashboard."
    },
    {
      question: "Can I delete messages?",
      answer: "Yes, you can delete messages from your device. However, please note that this won't delete the message from the recipient's device unless you're using the disappearing messages feature."
    },
    {
      question: "What happens to my data if I delete my account?",
      answer: "When you delete your account, all your data is permanently removed from our servers within 30 days. This includes your profile, contacts, and message history."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about SecureText.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
