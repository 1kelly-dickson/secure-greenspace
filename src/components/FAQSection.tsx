
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How secure is your encryption?",
    answer: "We use industry-standard AES-256 encryption for all messages and files. All data is encrypted on your device before being transmitted, ensuring that only the intended recipient can decrypt and read your messages."
  },
  {
    question: "Can I use this service on multiple devices?",
    answer: "Yes, you can access your secure account from any device with a web browser. Your encryption keys are synchronized securely across your authorized devices."
  },
  {
    question: "What happens if I forget my password?",
    answer: "For security reasons, we do not store your password or have access to your encrypted data. We strongly recommend setting up a recovery method in your account settings to prevent permanent data loss."
  },
  {
    question: "Are my messages stored on your servers?",
    answer: "Encrypted messages are temporarily stored on our servers until they are delivered to the recipient. For premium users, encrypted message history can be stored for longer periods but remains encrypted and inaccessible to anyone but the conversation participants."
  },
  {
    question: "Can you read my messages?",
    answer: "No. Our platform uses end-to-end encryption, which means only you and your intended recipients have the keys to decrypt your messages. Even our team cannot access the content of your communications."
  },
  {
    question: "Is there a limit to file sizes I can encrypt and share?",
    answer: "Free accounts can encrypt and share files up to 25MB. Premium accounts can encrypt files up to 1GB, and Team accounts have higher limits based on their plan."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-muted/30" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Find answers to commonly asked questions about our secure messaging and encryption services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <Link to="/contact" className="text-primary hover:underline font-medium">
            Contact our support team
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
