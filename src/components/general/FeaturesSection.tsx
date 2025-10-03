import {
  ArrowRightIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function FeaturesSection() {
  const features = [
    {
      title: "Easy Payment",
      description:
        "We provide various methods for you to carry out all transactions related to your finances.",
      icon: CreditCardIcon,
    },
    {
      title: "Safe Transaction",
      description:
        "We have the most up-to-date security to ensure all transactions are safe and secure.",
      icon: ShieldCheckIcon,
    },
    {
      title: "Fast Customer Service",
      description:
        "Provide customer service 24/7 for those who encounter problems or need assistance.",
      icon: ClockIcon,
    },
    {
      title: "Quick Transaction",
      description:
        "Faster transaction speeds than competitors, so money arrives and is received quickly.",
      icon: CheckCircleIcon,
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading + CTA */}
        <div className="mb-16 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0">
          <div className="text-center lg:text-left lg:max-w-lg">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enjoy the finest features with our products
            </h2>
            <p className="text-lg text-gray-500">
              We provide all the advantages that simplify your financial
              transactions without extra requirements.
            </p>
          </div>
          <a
            href="#"
            className="mt-4 lg:mt-0 inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-all"
          >
            Explore More
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4 transition-all duration-300 group-hover:bg-indigo-600">
                <feature.icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-all duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                {feature.title}
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
