"use client"

import { useEffect } from "react"

import { Link } from "react-router-dom"
import Navbar from '../../components/Navbar';
import Chatbot from '../../components/Chatbot';
import { Cpu, Layers, Zap, Printer, Settings, Users, Mail, Phone, MapPin } from "lucide-react"

function Homepage() {
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("active")
          void entry.target.offsetWidth
          entry.target.classList.add("active")
        } else {
          entry.target.classList.remove("active")
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px",
    })

    document.querySelectorAll(".scroll-reveal").forEach((element, index) => {
      const animationClass = `scroll-reveal-${index % 4}`
      element.classList.add(animationClass)
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen mesh-gradient overflow-hidden page-transition">
      <div className="fixed inset-0 grid-pattern opacity-30" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 light-beam opacity-20" />
        <div className="absolute inset-0 light-beam opacity-20" style={{ animationDelay: "-4s" }} />
      </div>

      <Navbar />

      <div className="relative pt-16">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:mt-28 lg:mb-12 ">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col text-left scroll-reveal">
              <div className="relative mb-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-tight text-white">
                  Unlock the world of <br />
                  <span className="relative">
                    <span className="relative z-10 font-normal bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                      3D Printing
                    </span>
                    <span className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 blur-lg opacity-50" />
                  </span>
                </h1>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 blur-xl opacity-50" />
              </div>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 font-light leading-relaxed">
              Explore 3D printing with our AI Chabot! Designed to provide step-by-step guidance in an easy conversational way.
              </p>
              <button className="group relative w-fit px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm text-white font-light border border-white/20 hover:bg-white/10 transition-all duration-300">
                <span className="relative z-10">  <Link to="/dashboard">Get Started</Link></span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            <div className="relative group scroll-reveal" style={{ transitionDelay: "0.2s" }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1705475025559-ad8efdedc74f?fm=jpg&q=60&w=2000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8M2QlMjBwcmludGVyfGVufDB8fDB8fHww"
                  alt="3D Printer in Action"
                  className="w-full h-[250px] sm:h-[300px] lg:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Core Features Section */}
        {/* <div className="relative max-w-6xl mx-auto px-4 py-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                title: "Precision Engineering",
                desc: "Industry-leading accuracy with cutting-edge technology for flawless prints.",
              },
              {
                icon: Zap,
                title: "Smart Assistance",
                desc: "AI-powered support available 24/7 to ensure your printing success.",
              },
              { icon: Layers, title: "Future-Ready", desc: "Stay ahead with regular updates and innovative features." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="group glass-effect p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500 hover:transform hover:scale-105 scroll-reveal"
                style={{ transitionDelay: `${i * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <Icon size={24} className="text-purple-400 mr-3" />
                  <h3 className="text-xl font-light text-white">{title}</h3>
                </div>
                <p className="text-gray-400 font-light">{desc}</p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div> */}

        {/* Features Section */}
        {/* <div className="relative py-32 features-bg">
          <div className="circle-animation circle-1" />
          <div className="circle-animation circle-2" />
          <div className="circle-animation circle-3" />

          <div className="absolute inset-0 overflow-hidden">
            <div className="orb-1" />
            <div className="orb-2" />
            <div className="orb-3" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="text-4xl font-light text-white mb-4">Advanced Features</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Discover the next generation of 3D printing capabilities with our cutting-edge features designed for
                professionals and enthusiasts alike.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Printer,
                  title: "Multi-Material Printing",
                  desc: "Print with multiple materials simultaneously for complex, functional parts.",
                },
                {
                  icon: Settings,
                  title: "Advanced Calibration",
                  desc: "Auto-calibration system ensures perfect bed leveling and print quality.",
                },
                {
                  icon: Zap,
                  title: "Real-time Monitoring",
                  desc: "Monitor your prints remotely with live HD camera feed and status updates.",
                },
                {
                  icon: Users,
                  title: "Community Hub",
                  desc: "Join our thriving community to share designs and get inspired.",
                },
                {
                  icon: Layers,
                  title: "Layer Analysis",
                  desc: "AI-powered layer analysis for optimal print quality and error detection.",
                },
                {
                  icon: Cpu,
                  title: "Smart Workflow",
                  desc: "Streamlined workflow with intelligent print queue management.",
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="feature-card group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-500 scroll-reveal"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-2">{title}</h3>
                    <p className="text-gray-400 font-light">{desc}</p>
                  </div>
                  <div className="card-glow" />
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Get in Touch Section */}
        {/* <div className="relative py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="glass-effect p-8 rounded-2xl border border-white/10 scroll-reveal">
                <h2 className="text-3xl font-light text-white mb-6">Get in Touch</h2>
                <p className="text-gray-400 mb-8">
                  Have questions about our 3D printing solutions? We're here to help you bring your ideas to life.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Mail size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-light">Email</p>
                      <a
                        href="mailto:contact@printmaster.com"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        contact@printmaster.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Phone size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-light">Phone</p>
                      <a href="tel:+1234567890" className="text-purple-400 hover:text-purple-300 transition-colors">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <MapPin size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-light">Location</p>
                      <p className="text-gray-400">123 Innovation Street, Tech City, TC 12345</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="glass-effect p-8 rounded-2xl border border-white/10 scroll-reveal"
                style={{ transitionDelay: "0.2s" }}
              >
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-light mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/20"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white font-light mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/20"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white font-light mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/20"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 rounded-xl bg-purple-500/10 text-purple-400 font-light border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div> */}

        {/* Footer */}
        <footer className="relative py-12 footer-gradient">
          <div className="footer-glow footer-glow-1" />
          <div className="footer-glow footer-glow-2" />

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            {/* <div className="grid md:grid-cols-4 gap-8">
              <div className="scroll-reveal">
                <div className="flex items-center space-x-2 mb-4">
                  <Printer size={24} className="text-purple-400" />
                  <h3 className="text-2xl font-light text-white">
                    Print
                    <span className="font-normal bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
                      Master
                    </span>
                  </h3>
                </div>
                <p className="text-gray-400 font-light">
                  Revolutionizing the future of manufacturing through advanced 3D printing technology.
                </p>
              </div>

              <div className="scroll-reveal" style={{ transitionDelay: "0.2s" }}>
                <h4 className="text-white font-light text-lg mb-4">Products</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      3D Printers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Materials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Software
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Accessories
                    </a>
                  </li>
                </ul>
              </div>

              <div className="scroll-reveal" style={{ transitionDelay: "0.4s" }}>
                <h4 className="text-white font-light text-lg mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Community
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div className="scroll-reveal" style={{ transitionDelay: "0.6s" }}>
                <h4 className="text-white font-light text-lg mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div> */}

            <div className="mt-12 pt-8 border-t border-white/10 text-center scroll-reveal">
              <p className="text-gray-400 font-light">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      <Chatbot />
    </div>
  )
}

export default Homepage

