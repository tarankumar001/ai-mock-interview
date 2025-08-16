import { Container } from "@/components/container";

export const AboutPage = () => {
  return (
    <Container>
      <div className="py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About AI Mock Interview</h1>
          
          <div className="prose prose-lg text-gray-700 space-y-6">
            <p>
              AI Mock Interview is an innovative platform designed to help job seekers prepare for their interviews 
              with confidence. Our cutting-edge AI technology provides realistic interview simulations that adapt 
              to your responses and provide instant feedback.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h2>
            <p>
              We believe that everyone deserves the opportunity to practice and improve their interview skills 
              in a safe, supportive environment. Our platform bridges the gap between preparation and performance, 
              helping you land your dream job.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How It Works</h2>
            <p>
              Our AI-powered system conducts realistic mock interviews tailored to your industry and role. 
              You'll receive instant feedback on your responses, body language, and overall performance, 
              allowing you to identify areas for improvement and build confidence.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Why Choose Us</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Realistic interview scenarios based on actual job requirements</li>
              <li>Instant AI feedback and scoring</li>
              <li>Practice interviews available 24/7</li>
              <li>Track your progress over time</li>
              <li>Industry-specific interview questions</li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};
