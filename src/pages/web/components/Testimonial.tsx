"use client";

import type React from "react";
import SectionTitle from "../components/ui/SectionTitle";
import AnimatedCard from "../components/ui/AnimatedCard";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  delay: number;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  role,
  company,
  image,
  delay,
}) => {
  return (
    <AnimatedCard
      delay={delay}
      className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <svg
            className="h-8 w-8 text-blue-400 dark:text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
          {quote}
        </p>
        <div className="flex items-center">
          <img
            src={image || "/placeholder.svg"}
            alt={author}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <div className="font-medium text-blue-600 dark:text-blue-400">
              {author}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {role}, {company}
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "StockWise AIIMS transformed our warehouse operations. The AI recommendations have helped us reduce stockouts by over 30% and improved our inventory turnover significantly.",
      author: "Sarah Johnson",
      role: "Operations Manager",
      company: "Global Retail Inc.",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      quote:
        "The multilingual support has been a game-changer for our international team. We can now collaborate seamlessly across locations, and the real-time tracking keeps everyone on the same page.",
      author: "David Chen",
      role: "Supply Chain Director",
      company: "Pacific Trade Co.",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      quote:
        "As a small business owner, I was skeptical about implementing an AI system, but StockWise AIIMS was surprisingly intuitive. The analytics have given us insights we never had before.",
      author: "Aisha Patel",
      role: "Owner",
      company: "Modern Boutique",
      image:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Trusted by Businesses Worldwide"
          subtitle="Hear what our customers have to say about StockWise AIIMS"
          centered
          className="text-gray-900 dark:text-white"
          subtitleClassName="text-gray-700 dark:text-gray-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              image={testimonial.image}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
