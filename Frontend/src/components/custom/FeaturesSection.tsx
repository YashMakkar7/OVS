
import FeatureCard from './FeatureCard';
import ShieldIcon from '../icons/ShieldIcon';
import { BarChart3, Lock, CheckCircle, Users, Clock } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="w-full h-full" />,
      title: "Advanced Analytics",
      description: "Get real-time insights with detailed voting analytics, participation rates, and demographic breakdowns."
    },
    {
      icon: <ShieldIcon className="w-full h-full" />,
      title: "End-to-End Security",
      description: "Military-grade encryption ensures that all votes remain secure, private, and tamper-proof."
    },
    {
      icon: <Lock className="w-full h-full" />,
      title: "Tamper-Proof Records",
      description: "Every vote is securely recorded and cannot be altered once submitted, ensuring complete integrity."
    },
    {
      icon: <Users className="w-full h-full" />,
      title: "Easy User Management",
      description: "Manage voter access, permissions, and authentication with our intuitive admin dashboard and user-friendly interface.",
  
    },
    {
      icon: <CheckCircle className="w-full h-full" />,
      title: "Transparent Process",
      description: "Our system ensures full transparency while maintaining voter anonymity and privacy.",
      variant: "large"
    },
    {
      icon: <Clock className="w-full h-full" />,
      title: "Real-Time Results",
      description: "View results as they come in with beautiful visualizations and exportable reports.",
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Platform Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our voting platform combines cutting-edge security with intuitive design to deliver
            a seamless voting experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              variant="centered"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 