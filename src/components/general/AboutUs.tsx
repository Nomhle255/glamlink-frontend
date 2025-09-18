import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function AboutUs() {
  return (
    <section className="py-24 relative" id="about-us">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
          
          {/* Left side images */}
          <div className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
            <div className="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
              <img
                className="rounded-xl object-cover"
                src="/assets/hair.png.jpg"
                alt="about Us image"
              />
            </div>
            <img
              className="sm:ml-0 ml-auto rounded-xl object-cover"
              src="/assets/nails.png"
              alt="about Us image"
            />
          </div>

          {/* Right side content */}
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                  Why GlamLink?
                </h2>
                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                    GlamLink is built for beauty service providers to streamline client
                    bookings, manage services, and grow their business. Whether you’re an
                    independent stylist or a salon, GlamLink is your partner for success.
                </p>
              </div>

              {/* Stats */}
              <div className="w-full lg:justify-start justify-center items-center sm:gap-10 gap-5 inline-flex">
                <div className="flex-col justify-start items-start inline-flex">
                  <h3 className="font-bold text-xl mb-4">
                    Easy Bookings
                  </h3>
                  <p className="text-gray-500 text-base font-normal leading-relaxed">
                    Manage and confirm client appointments with just a few clicks.
                  </p>
                </div>
                <div className="flex-col justify-start items-start inline-flex">
                    <h3 className="font-bold text-xl mb-4">
                        Smart Dashboard
                    </h3>
                    <p className="text-gray-600">
                        Get insights into your services, bookings, and client activity.
                    </p>
                </div>
                <div className="flex-col justify-start items-start inline-flex">
                    <h3 className="font-bold text-xl mb-4">
                        💬 Stay Connected
                    </h3>
                    <p className="text-gray-500 text-base font-normal leading-relaxed">
                        Chat with clients directly via WhatsApp and keep them engaged.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}