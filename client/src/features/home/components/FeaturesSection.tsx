import React from 'react';
import Card from '../../../components/ui/Card';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'AI Flashcards',
      description: 'Generate intelligent flashcards from any text or topic instantly.',
      icon: '🃏'
    },
    {
      title: 'Smart Q&A',
      description: 'Get instant answers to your study questions with AI assistance.',
      icon: '❓'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your learning progress and identify areas for improvement.',
      icon: '📊'
    },
    {
      title: 'Study Plans',
      description: 'Personalized study schedules tailored to your learning goals.',
      icon: '📅'
    }
  ];

  return (
    <section id="features" className="py-20 ">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Powerful Features for Better Learning
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Discover how ClassMateAI can revolutionize your study sessions
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;