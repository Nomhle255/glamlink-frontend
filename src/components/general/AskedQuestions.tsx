"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "How to create an account?",
    answer:
      "To create an account, find the 'Sign up' button, fill out the registration form with your personal information, and click 'Sign up.' Then log in to start using the platform.",
  },
  {
    question: "Have any trust issue?",
    answer:
      "We prioritize building a robust and user-friendly web app that ensures you can manage your services and bookings with confidence, and achieve your marketing goals with ease.",
  },
  {
    question: "What is the payment process?",
    answer:
      "Payments can be made securely using various options like credit card, PayPal, or direct bank transfer. You’ll receive confirmation once the transaction is complete.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24" id="questions">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
          {/* Left Image */}
          <div className="w-full lg:w-1/2">
            <Image
              src="/assets/hair.png.jpg"
              alt="FAQ section"
              width={600}
              height={400}
              className="w-full rounded-xl object-cover"
            />
          </div>

          {/* Right FAQ Section */}
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-xl">
              <div className="mb-6 lg:mb-16 text-center lg:text-left">
                <h6 className="text-lg font-medium text-indigo-600 mb-2">
                  FAQs
                </h6>
                <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
                  Looking for answers?
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {faqs.map((faq, index) => (
                  <div key={index} className="py-6">
                    <button
                      className="w-full flex justify-between items-center text-left text-xl font-normal leading-8 text-gray-600 transition duration-300 hover:text-indigo-600"
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                    >
                      <span>{faq.question}</span>
                      <ChevronDownIcon
                        className={`w-6 h-6 transform transition-transform duration-300 ${
                          openIndex === index ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </button>
                    {openIndex === index && (
                      <div className="mt-3 pr-4 text-base font-normal text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}