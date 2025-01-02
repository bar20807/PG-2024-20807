import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const PrivacyPolicy = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // Simulate loading time
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
        <div className="flex flex-col items-center">
          <img
            src="/static/images/logo_V1.png"
            alt="Loading Logo"
            className="w-32 h-32 animate-spin"
          />
          <p className="text-whiteTextPlatyfa text-xl mt-4">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brownCardInformation min-h-screen">
      <div className="py-8 px-4 sm:px-6 md:px-8 lg:px-20">
        <div
          ref={ref}
          className={`flex flex-col items-stretch p-4 md:p-6 space-y-6 max-w-screen-xl mx-auto transition-opacity duration-500 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-principalCardColor bg-opacity-90 rounded-lg p-8 shadow-lg">
            {/* Title adjustment */}
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-whiteTextPlatyfa mb-6 bg-brownCardInformation text-center rounded-lg p-4 max-w-lg mx-auto opacity-80">
              Privacy Policy
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-whiteTextPlatyfa text-center bg-brownCardInformation rounded-lg opacity-70 p-4 md:p-6 font-light mb-6">
              At Platyfa, we value your privacy and are committed to protecting the personal information you share with us. Below, we explain how we collect, use, and store your data.
            </p>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-whiteTextPlatyfa mb-4 bg-brownCardInformation rounded-lg p-4 text-center opacity-70">
                1. Information We Collect
              </h2>
              <ul className="list-disc pl-6 text-whiteTextPlatyfa text-sm md:text-lg">
                <li>Personal data provided during registration, such as name, email, username, and country.</li>
                <li>Game statistics, such as levels played, scores, duration, and game results.</li>
                <li>IP addresses and location data (when relevant).</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-whiteTextPlatyfa mb-4 bg-brownCardInformation rounded-lg p-4 text-center opacity-70">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-whiteTextPlatyfa text-sm md:text-lg">
                <li>To manage your account and personalize your game experience.</li>
                <li>To analyze statistics and improve gameplay.</li>
                <li>To comply with legal obligations and protect our rights.</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-whiteTextPlatyfa mb-4 bg-brownCardInformation rounded-lg p-4 text-center opacity-70">
                3. How We Share Your Information
              </h2>
              <ul className="list-disc pl-6 text-whiteTextPlatyfa text-sm md:text-lg">
                <li>We do not share your information with third parties without your consent, except in the following cases:</li>
                <ul className="list-decimal pl-8">
                  <li>When required by law.</li>
                  <li>For essential services (e.g., image storage via Firebase).</li>
                </ul>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-whiteTextPlatyfa mb-4 bg-brownCardInformation rounded-lg p-4 text-center opacity-70">
                4. Your Rights
              </h2>
              <ul className="list-disc pl-6 text-whiteTextPlatyfa text-sm md:text-lg">
                <li>Access: Request a copy of the personal data we have about you.</li>
                <li>Rectification: Correct inaccurate or incomplete data.</li>
                <li>Deletion: Request the deletion of your personal data.</li>
                <li>Portability: Obtain your data in a structured and portable format.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-whiteTextPlatyfa mb-4 bg-brownCardInformation rounded-lg p-4 text-center opacity-70">
                5. Security
              </h2>
              <p className="text-sm md:text-lg text-whiteTextPlatyfa text-justify bg-brownCardInformation rounded-lg p-4 opacity-70">
                We implement technical and organizational measures to protect your personal information against unauthorized access, loss, alteration, or disclosure. However, no system is completely secure, so we cannot guarantee the absolute security of your data.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
