import React from "react";

function Benefits(){
    return(
        <div className="bg-blue-50 py-16 w-full">
        <div className="px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose UniStay?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Properties",
                description: "All our properties are thoroughly verified for your peace of mind."
              },
              {
                title: "Student-Focused",
                description: "Properties selected specifically for students' needs and budgets."
              },
              {
                title: "Easy Booking",
                description: "Simple and straightforward process to secure your accommodation."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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
      </div>
    )
}
export default Benefits;