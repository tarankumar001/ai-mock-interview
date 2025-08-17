import { Container } from "@/components/container";

export const AboutPage = () => {
  return (
    <Container>
      <div className="py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            About AI Mock Interview
          </h1>

          <div className="prose prose-lg text-gray-700 space-y-6">
            <p>
              Welcome 👋 This project was built to make interview prep a little
              less scary and a lot more accessible. Instead of waiting for the
              “real thing,” you can practice anytime and get instant feedback
              from an AI that actually listens to your answers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              The Idea
            </h2>
            <p>
              Interviews are tough. You can know your stuff but still freeze up
              when questions hit you out of nowhere. I wanted a space where
              anyone could practice without pressure, get honest feedback, and
              improve with each attempt.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              How It Works
            </h2>
            <p>
              It’s simple: pick a role or industry, start a mock session, and
              answer questions as if it’s the real deal. The AI will give you
              pointers on your responses and help you notice where you can do
              better next time.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Why Try It
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Practice anytime, anywhere—no scheduling needed</li>
              <li>Feedback that’s instant and practical</li>
              <li>Questions based on real job interviews</li>
              <li>Track your growth and confidence over time</li>
            </ul>

            <p className="mt-8">
              This is just the beginning 🚀 I’ll keep improving it with new
              features and more realistic scenarios. Hopefully, it helps you
              walk into your next interview feeling ready.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};
