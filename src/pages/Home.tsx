import React from 'react'

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-6 px-4 sm:px-0">
        <h2 className="text-3xl sm:text-5xl font-bold text-yellow-300 mb-4 a-fade-up">Together We Build Tomorrow's Solutions</h2>
  <p className="text-base sm:text-xl text-aura leading-relaxed max-w-3xl mx-auto a-fade-up">
            We (Aura-7F), the Clan of Byte Bash Blitz — united by passion, driven by purpose. We're a team of developers committed to crafting exceptional software through collaboration and innovation.
        </p>
      </div>

          <div className="mt-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-8 text-center a-fade-up">Our Core Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 a-stagger">
                <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card a-fade-up">
                  <div className="text-4xl mb-4">🤝</div>
                  <h4 className="text-xl font-bold text-yellow-300 mb-2">Unity Builders</h4>
                  <h5 className="text-lg text-yellow-200 mb-3">Collaboration</h5>
                    <p className="text-aura">Fostering seamless teamwork and cross-functional collaboration across projects</p>
                </div>
                <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card a-fade-up">
                  <div className="text-4xl mb-4">📚</div>
                  <h4 className="text-xl font-bold text-yellow-300 mb-2">Knowledge Sharers</h4>
                  <h5 className="text-lg text-yellow-200 mb-3">Learning</h5>
                    <p className="text-aura">Promoting continuous learning and open knowledge sharing within the team</p>
                </div>
                <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card a-fade-up">
                  <div className="text-4xl mb-4">🏆</div>
                  <h4 className="text-xl font-bold text-yellow-300 mb-2">Quality Champions</h4>
                  <h5 className="text-lg text-yellow-200 mb-3">Excellence</h5>
                    <p className="text-aura">Committed to delivering high-quality solutions that exceed expectations</p>
                </div>
              </div>
          </div>

      <div className="mt-12">
  <h3 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-8 text-center a-fade-up">Team Aura</h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 a-stagger">
          <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card text-center a-pop">
            <div className="text-3xl font-bold text-yellow-300 mb-2">99.9%</div>
              <p className="text-aura">Collaboration</p>
          </div>
          <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card text-center a-pop">
            <div className="text-3xl font-bold text-yellow-300 mb-2">24/7</div>
              <p className="text-aura">Support</p>
          </div>
          <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card text-center a-pop">
            <div className="text-3xl font-bold text-yellow-300 mb-2">10+</div>
              <p className="text-aura">Projects Delivered</p>
          </div>
          <div className="bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card text-center a-pop">
            <div className="text-3xl font-bold text-yellow-300 mb-2">∞</div>
              <p className="text-aura">Learning & Growth</p>
          </div>
        </div>
      </div>
    </div>
  )
}
