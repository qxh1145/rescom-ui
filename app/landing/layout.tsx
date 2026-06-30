import './landing.css'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-landing-bg bg-paper text-landing-fg font-patrick selection:bg-landing-yellow selection:text-landing-fg">
      {children}
    </div>
  )
}
