import React from "react";

function MiddleSection(){
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-6">Why We Started</h2>
            <p className="text-lg text-zinc-600 mb-4">
              We recognized a critical challenge in student life: finding safe, affordable 
              housing should never be a cause for stress or anxiety. As former students 
              ourselves, we felt this pain point firsthand, and we knew there had to be 
              a better way.
            </p>
            <p className="text-lg text-zinc-600">
              That's why we're building a platform that redefines how students find 
              housing—making it transparent, secure, and effortless. Every student 
              deserves a place that feels like home, and we're here to make that happen.
            </p>
          </div>
          <div className="bg-zinc-100 h-64 rounded-lg"></div>
        </div>
      </section>
    )
}

export default MiddleSection;