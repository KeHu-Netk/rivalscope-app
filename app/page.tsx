import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-black text-3xl">RS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome to RivalScope
          </h1>
          <p className="text-xl text-gray-400 mb-2">See Everything. Miss Nothing.</p>
          <p className="text-lg text-gray-500">AI-powered competitor intelligence platform</p>
        </div>
        
        <div className="space-y-4 mb-12">
          <Link 
            href="/auth" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-3 rounded-lg inline-block font-semibold text-lg transition transform hover:scale-105"
          >
            Get Started
          </Link>
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-400">24/7</div>
            <p className="text-gray-400 text-sm">Monitoring</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">Real-time</div>
            <p className="text-gray-400 text-sm">Alerts</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">AI-Powered</div>
            <p className="text-gray-400 text-sm">Insights</p>
          </div>
        </div>
      </div>
    </div>
  )
}
