import React from "react";

function Benefits() {
  const benefits = [
    {
      title: "Verified Properties",
      description: "All our properties are thoroughly verified for your peace of mind.",
      icon: "🏠"
    },
    {
      title: "Student-Focused",
      description: "Properties selected specifically for students' needs and budgets.",
      icon: "👨‍🎓"
    },
    {
      title: "Easy Booking",
      description: "Simple and straightforward process to secure your accommodation.",
      icon: "✅"
    }
  ];

  return (
    <section className="w-full  py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose UniStay?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;