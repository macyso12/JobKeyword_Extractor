import { Zap, Brain, Copy } from "lucide-react";

export function FeatureCards() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      title: "Fast Extraction",
      description: "Get results in under 5 seconds with our optimized NLP processing.",
      bgColor: "bg-blue-100"
    },
    {
      icon: <Brain className="h-6 w-6 text-emerald-500" />,
      title: "Smart Categorization", 
      description: "Automatically sorts keywords into relevant skill categories.",
      bgColor: "bg-emerald-100"
    },
    {
      icon: <Copy className="h-6 w-6 text-purple-500" />,
      title: "Easy Export",
      description: "Copy all keywords with one click for resume optimization.",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="mt-12 grid md:grid-cols-3 gap-6" data-testid="feature-cards">
      {features.map((feature, index) => (
        <div key={index} className="bg-white rounded-lg p-6 border border-gray-200" data-testid={`feature-card-${index}`}>
          <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
            {feature.icon}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
