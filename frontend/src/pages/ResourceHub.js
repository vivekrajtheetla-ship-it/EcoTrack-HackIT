import React from 'react';

const ResourceHub = () => {
  const sustainableTips = [
    "Reduce meat consumption by 50% to cut food-related emissions by 20%",
    "Switch to LED lighting to reduce energy consumption by up to 80%",
    "Use public transportation or bike for trips under 3 miles",
    "Unplug electronics when not in use to prevent phantom energy drain",
    "Choose locally sourced, seasonal foods to reduce transportation emissions"
  ];

  const externalResources = [
    {
      title: "EIA Energy Report (PDF)",
      description: "Comprehensive analysis of global energy consumption and carbon emissions",
      url: "#",
      type: "PDF"
    },
    {
      title: "Calculate Your Water Footprint",
      description: "Interactive tool to measure your water usage impact",
      url: "#",
      type: "Tool"
    },
    {
      title: "Carbon Footprint Calculator",
      description: "Advanced calculator for comprehensive lifestyle assessment",
      url: "#",
      type: "Calculator"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Resource Hub</h1>
        <p className="text-xl text-gray-600">
          Discover tools, tips, and resources to accelerate your journey toward a more sustainable lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sustainable Living Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Sustainable Living Tips</h2>
          </div>
          
          <div className="space-y-4">
            {sustainableTips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-green-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              💡 Pro Tip: Start with one tip per week for sustainable habit building!
            </p>
          </div>
        </div>

        {/* External Resources */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">External Resources</h2>
          </div>

          <div className="space-y-4">
            {externalResources.map((resource, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {resource.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                  Access Resource
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              📚 New resources added weekly - bookmark this page!
            </p>
          </div>
        </div>

        {/* Local Initiatives */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Local Initiatives</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Find Green Groups Near You</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Connect with like-minded individuals in your community who are passionate about environmental sustainability. 
                Local groups often organize tree planting events, community gardens, and educational workshops.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Popular Local Activities:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Community composting programs</li>
                <li>• Local farmers market initiatives</li>
                <li>• Neighborhood solar co-ops</li>
                <li>• Environmental cleanup events</li>
                <li>• Sustainable living workshops</li>
              </ul>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-600 font-medium mb-2">Search for Local Groups</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                Find Groups Near Me
              </button>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800 font-medium">
                🤝 Join forces with your community for greater environmental impact!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl mb-6 opacity-90">
          Start tracking your carbon footprint today and join thousands of eco-warriors making a positive impact.
        </p>
        <button className="bg-white text-green-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200">
          Start Tracking Now
        </button>
      </div>
    </div>
  );
};

export default ResourceHub;