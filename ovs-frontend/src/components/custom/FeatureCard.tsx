import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'centered' | 'large';
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  variant = 'default' 
}: FeatureCardProps) => {
  // Tailwind classes based on variant
  const containerClasses = {
    default: "flex flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow",
    centered: "flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow",
    large: "flex flex-col p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
  };

  const iconClasses = {
    default: "w-12 h-12 text-indigo-600 mb-4",
    centered: "w-14 h-14 text-indigo-600 mb-5",
    large: "w-16 h-16 text-indigo-600 mb-6"
  };

  const titleClasses = {
    default: "text-xl font-bold mb-2",
    centered: "text-xl font-bold mb-3",
    large: "text-2xl font-bold mb-4"
  };

  const descriptionClasses = {
    default: "text-gray-600",
    centered: "text-gray-600",
    large: "text-gray-600 text-lg"
  };

  return (
    <div className={containerClasses[variant]}>
      <div className={iconClasses[variant]}>
        {icon}
      </div>
      <h3 className={titleClasses[variant]}>{title}</h3>
      <p className={descriptionClasses[variant]}>{description}</p>
    </div>
  );
};

export default FeatureCard; 