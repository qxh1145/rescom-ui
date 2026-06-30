import { HandButton } from "@/components/hand-drawn/Button"
import { HandCard } from "@/components/hand-drawn/Card"
import { HandInput } from "@/components/hand-drawn/Input"
import { ArrowDownRight, CheckCircle2, PenTool, Users, Zap, Mail, Twitter, Github } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden w-full selection:bg-landing-yellow selection:text-landing-fg">
      {/* Decorative scribbles - Background */}
      <div className="pointer-events-none absolute left-[-50px] top-[10%] opacity-20 -rotate-12 hidden md:block">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,100 Q50,20 100,100 T190,100" stroke="#2d2d2d" strokeWidth="4" fill="none" strokeDasharray="10 10" />
          <circle cx="100" cy="100" r="80" stroke="#2d2d2d" strokeWidth="3" fill="none" className="animate-pulse" />
        </svg>
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-20 flex flex-col gap-32">
        
        {/* --- Hero Section --- */}
        <section className="grid md:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-8 z-10">
            <div className="inline-block px-4 py-1 bg-landing-yellow border-2 border-landing-border radius-wobbly shadow-hard-sm -rotate-2">
              <span className="font-patrick font-bold text-landing-fg">Now in Beta! ✨</span>
            </div>
            
            <h1 className="font-kalam text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-landing-fg">
              Build stuff that actually <span className="text-landing-accent inline-block rotate-2 relative">feels human</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-landing-fg/80 max-w-lg leading-relaxed">
              Drop the clinical perfection. Create digital experiences with authentic texture, wobbly edges, and a pulse.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start pt-4 relative">
              <HandButton size="lg" className="-rotate-1">Start Sketching</HandButton>
              <HandButton size="lg" variant="secondary" className="rotate-1">View Gallery</HandButton>
              
              {/* Hand-drawn arrow pointing to CTA */}
              <div className="hidden md:block absolute -right-16 top-16 text-landing-fg opacity-60">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-12">
                  <path d="M10,10 Q40,40 20,80" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="8 6" />
                  <path d="M10,70 L20,80 L35,65" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mx-auto md:mx-0">
            <div className="absolute -inset-4 bg-landing-yellow/30 radius-wobbly blur-2xl -z-10" />
            <HandCard decoration="tape" className="p-2 -rotate-2 transform hover:rotate-0 transition-transform duration-300 max-w-sm mx-auto bg-white">
              <div className="aspect-[4/5] bg-landing-muted radius-wobbly flex items-center justify-center border-2 border-dashed border-landing-border relative overflow-hidden">
                <span className="font-kalam text-2xl text-landing-fg/50 -rotate-12">Image goes here!</span>
                {/* Corner frame marks */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-landing-border" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-landing-border" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-landing-border" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-landing-border" />
              </div>
            </HandCard>
            
            {/* Bouncing decorative element */}
            <div className="absolute -bottom-8 -right-8 bg-white border-[3px] border-landing-border rounded-full p-4 shadow-hard flex items-center justify-center animate-bounce z-20">
              <PenTool className="w-8 h-8 text-landing-secondary" strokeWidth={2.5} />
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="space-y-16 py-10 relative">
          <div className="text-center space-y-4 relative z-10">
            <h2 className="font-kalam text-4xl md:text-5xl text-landing-fg">Why perfectly imperfect?</h2>
            <p className="text-xl max-w-2xl mx-auto">Because corporate UI is boring and nobody likes talking to a robot.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <HandCard interactive decoration="tack" className="bg-white">
              <div className="w-12 h-12 bg-landing-yellow rounded-full flex items-center justify-center border-2 border-landing-border mb-6">
                <Users className="w-6 h-6 text-landing-fg" strokeWidth={2.5} />
              </div>
              <h3 className="font-kalam text-2xl font-bold mb-3">Instantly Relatable</h3>
              <p className="text-landing-fg/80 leading-relaxed">
                Rough edges lower the barrier to entry. Users feel like they can make mistakes and explore safely.
              </p>
            </HandCard>
            
            <HandCard interactive decoration="tape" variant="post-it" className="-rotate-1 md:scale-105 z-10">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-landing-border mb-6 shadow-hard-sm">
                <Zap className="w-6 h-6 text-landing-accent" strokeWidth={2.5} />
              </div>
              <h3 className="font-kalam text-2xl font-bold mb-3">Creative Energy</h3>
              <p className="text-landing-fg/80 leading-relaxed">
                Ditch the grid. Small rotations and hard offset shadows create a playful, dynamic environment.
              </p>
            </HandCard>
            
            <HandCard interactive decoration="none" className="rotate-1 bg-white">
              <div className="w-12 h-12 bg-landing-muted rounded-full flex items-center justify-center border-2 border-landing-border mb-6">
                <CheckCircle2 className="w-6 h-6 text-landing-secondary" strokeWidth={2.5} />
              </div>
              <h3 className="font-kalam text-2xl font-bold mb-3">Actually Usable</h3>
              <p className="text-landing-fg/80 leading-relaxed">
                Despite looking like a napkin sketch, everything is fully accessible, responsive, and predictable.
              </p>
            </HandCard>
          </div>
        </section>
        
        {/* --- How It Works --- */}
        <section className="py-12 border-y-[3px] border-dashed border-landing-border my-12 relative">
          <div className="absolute inset-0 bg-white/40 -z-10" />
          <h2 className="font-kalam text-4xl md:text-5xl text-center mb-16">How we do it</h2>
          
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
            {/* Connecting squiggly line */}
            <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-[3px] -translate-y-1/2 z-0">
               <svg width="100%" height="20" preserveAspectRatio="none" className="overflow-visible">
                 <path d="M0,10 Q50,-10 100,10 T200,10 T300,10 T400,10 T500,10 T600,10 T700,10 T800,10 T900,10 T1000,10" 
                       stroke="#2d2d2d" strokeWidth="3" fill="none" strokeDasharray="8 8" />
               </svg>
            </div>
            
            {[
              { step: '1', title: 'Sketch Idea', desc: 'Jot it down like you would on a sticky note.', rotate: '-rotate-2' },
              { step: '2', title: 'Add Wiggle', desc: 'Apply our custom wobbly radius variables.', rotate: 'rotate-1' },
              { step: '3', title: 'Ship It', desc: 'Deploy and watch your users smile.', rotate: '-rotate-1' }
            ].map((item, i) => (
              <div key={item.step} className={`relative z-10 flex flex-col items-center text-center ${item.rotate}`}>
                <div className="w-16 h-16 bg-white border-[3px] border-landing-border radius-wobbly flex items-center justify-center shadow-hard mb-6 font-kalam text-3xl font-bold text-landing-accent">
                  {item.step}
                </div>
                <h3 className="font-kalam text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* --- Testimonial --- */}
        <section className="max-w-3xl mx-auto">
          <HandCard variant="speech" decoration="none" className="mb-12 rotate-1">
            <p className="font-kalam text-2xl md:text-3xl leading-relaxed text-center">
              "It's like looking at my own notebook, but it actually clicks and types. I've never had so much fun filling out a form."
            </p>
          </HandCard>
          <div className="flex items-center gap-4 ml-8">
            <div className="w-14 h-14 rounded-full border-2 border-landing-border bg-landing-muted flex items-center justify-center -rotate-6">
              <span className="font-kalam font-bold text-xl">JD</span>
            </div>
            <div>
              <div className="font-kalam text-xl font-bold">Jane Doe</div>
              <div className="text-landing-fg/70">Creative Director</div>
            </div>
          </div>
        </section>

        {/* --- Newsletter / CTA --- */}
        <section className="bg-landing-yellow p-8 md:p-12 border-[3px] border-landing-border radius-wobbly shadow-hard-lg relative my-10 overflow-hidden">
          {/* Decorative SVG in background */}
          <div className="absolute -right-10 -top-10 opacity-10 rotate-45">
            <svg width="200" height="200" viewBox="0 0 200 200">
               <rect x="20" y="20" width="160" height="160" stroke="#2d2d2d" strokeWidth="10" fill="none" rx="20" />
               <line x1="20" y1="20" x2="180" y2="180" stroke="#2d2d2d" strokeWidth="10" />
               <line x1="180" y1="20" x2="20" y2="180" stroke="#2d2d2d" strokeWidth="10" />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <h2 className="font-kalam text-4xl md:text-5xl font-bold">Don't miss the launch</h2>
            <p className="text-xl">Join the waitlist to get early access to the UI kit.</p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
              <HandInput placeholder="Email address..." className="flex-1" />
              <HandButton type="submit">Subscribe</HandButton>
            </form>
            
            <div className="text-sm pt-4 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /> No spam. Just good vibes.
            </div>
          </div>
        </section>
        
      </main>
      
      {/* --- Footer --- */}
      <footer className="border-t-[3px] border-landing-border bg-white pt-16 pb-8 px-6 mt-20 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="font-kalam text-3xl font-bold -rotate-2 inline-block">Rescom UI</div>
            <p className="max-w-sm text-landing-fg/80">
              The anti-corporate design system for builders who want their apps to feel alive.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-kalam font-bold text-xl relative inline-block">
              Resources
              {/* Wavy underline */}
              <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                <path d="M0,3 Q10,0 20,3 T40,3 T60,3 T80,3 T100,3" stroke="#ff4d4d" strokeWidth="2" fill="none" />
              </svg>
            </h4>
            <ul className="space-y-2 mt-4">
              <li><a href="#" className="hover:line-through decoration-2 transition-all">Documentation</a></li>
              <li><a href="#" className="hover:line-through decoration-2 transition-all">Components</a></li>
              <li><a href="#" className="hover:line-through decoration-2 transition-all">Figma File</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-kalam font-bold text-xl relative inline-block">
              Connect
              <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                <path d="M0,3 Q10,6 20,3 T40,3 T60,3 T80,3 T100,3" stroke="#2d5da1" strokeWidth="2" fill="none" />
              </svg>
            </h4>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-10 h-10 border-2 border-landing-border radius-wobbly flex items-center justify-center hover:bg-landing-yellow hover:-translate-y-1 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 border-2 border-landing-border radius-wobbly flex items-center justify-center hover:bg-landing-yellow hover:-translate-y-1 transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center border-t-2 border-dashed border-landing-border pt-8 text-landing-fg/60">
          <p>© {new Date().getFullYear()} Rescom UI. Built with chaotic good energy.</p>
        </div>
      </footer>
    </div>
  )
}
