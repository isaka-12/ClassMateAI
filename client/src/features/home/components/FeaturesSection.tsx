import React from 'react';
import Card from '../../../components/ui/Card';
import { AutoAwesome, Quiz, TrendingUp,  Chat } from '@mui/icons-material';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'AI That Understands Your Notes',
      description: 'Not generic summaries—ClassMateAI tailors flashcards, quizzes, and summaries from your real class materials.',
      icon: AutoAwesome
    },
    {
      title: 'Flashcards in a Flash',
      description: 'Upload a file, and boom—instant flashcards generated with precision and clarity, ready for smart study sessions.',
      icon: TrendingUp
    },
    {
      title: 'Quiz Yourself Like a Pro',
      description: 'Our quiz builder tests you with questions generated from your own content, not textbook fluff.',
      icon: Quiz
    },
    {
      title: 'Chat With Your Notes',
      description: 'ClassMate AI acts as a smart study buddy. Ask questions, get explanations, or quiz yourself—just like chatting with a genius friend.',
      icon: Chat
    },
    {
      title: 'All-in-One Study Hub',
      description: 'From uploading class notes to revising and self-testing—ClassMate AI keeps everything in one clean, intuitive space.',
      icon: AutoAwesome
    },
    {
      title: 'Made by Students for Students',
      description: 'Developed by real students to make your study grind smarter, faster, and more fun.',
      icon: AutoAwesome
    }
  ];

  return (
    <section id="features" className="py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl animate-fade-in-up">
            What Sets <span className="text-secondary">ClassMate</span>AI Apart?
          </h2>
          <p className="max-w-2xl mx-auto text-[24px] md:text-[32px] text-gray animate-fade-in-up animation-delay-200">
            Smart learning with AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-6 text-center transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 group animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <IconComponent 
                    className="mx-auto transition-all duration-300 text-secondary group-hover:drop-shadow-lg" 
                    sx={{ fontSize: 48 }}
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-secondary">
                  {feature.title}
                </h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;