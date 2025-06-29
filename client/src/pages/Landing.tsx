import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Target, Users, Briefcase, Palette } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Business Management",
      description: "CRM, accounting, and team collaboration tools",
      link: "/crm",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Creative Studio",
      description: "AI-powered image generation and design tools",
      link: "/creative-studio",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Marketing Suite",
      description: "Campaign management and analytics",
      link: "/marketing",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Knowledge base and team communication",
      link: "/knowledge-base",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Sparkles className="mr-2 h-4 w-4" />
            All-in-One Business Platform
          </Badge>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Power Your Business with
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}AI-Enhanced Tools
            </span>
          </h1>
          
          <p className="mb-10 text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Streamline operations, boost creativity, and grow your business with our integrated suite of professional tools powered by artificial intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8">
              <Link to="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/dashboard/creative">
                Try AI Studio
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From customer management to creative design, our platform provides all the tools your business needs in one place.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full justify-start px-0 text-blue-600 hover:text-blue-700">
                    <Link to={feature.link}>
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-0 text-white">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of businesses already using our platform to streamline operations and boost growth.
              </p>
              <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/login">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;