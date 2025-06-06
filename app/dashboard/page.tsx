'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { 
  Plus, Bell, TrendingUp, TrendingDown, Eye, 
  DollarSign, Users, MessageCircle,
  Star, LogOut, Settings, ChevronRight, X
} from 'lucide-react'

interface Competitor {
  id: string
  name: string
  website: string
  logo: string
  score: number
  score_change: number
  last_checked: string
  alerts: number
}

export default function Dashboard() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCompetitor, setNewCompetitor] = useState({ name: '', website: '' })
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadCompetitors()
  }, [])

  const loadCompetitors = async () => {
    try {
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompetitors(data || [])
    } catch (error) {
      console.error('Error loading competitors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const addCompetitor = async () => {
    if (!newCompetitor.name || !newCompetitor.website) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('competitors')
        .insert({
          user_id: user.id,
          name: newCompetitor.name,
          website: newCompetitor.website,
          logo: newCompetitor.name.substring(0, 2).toUpperCase(),
          score: Math.floor(Math.random() * 30) + 70,
          score_change: Math.floor(Math.random() * 10) - 5,
          last_checked: new Date().toISOString(),
          alerts: 0
        })
        .select()
        .single()

      if (error) throw error
      
      setCompetitors([data, ...competitors])
      setShowAddModal(false)
      setNewCompetitor({ name: '', website: '' })
    } catch (error) {
      console.error('Error adding competitor:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-lg">RS</span>
                </div>
                <h1 className="text-xl font-bold">RivalScope</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition">
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={handleLogout} className="p-2 hover:bg-gray-800 rounded-lg transition">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Competitors tracked</span>
              <Eye className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-3xl font-bold">{competitors.length}</p>
            <p className="text-sm text-gray-500">of 3 max (beta)</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Active alerts</span>
              <Bell className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-red-400">0</p>
            <p className="text-sm text-gray-500">All clear</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Average score</span>
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-3xl font-bold">
              {competitors.length > 0 
                ? Math.round(competitors.reduce((acc, c) => acc + c.score, 0) / competitors.length)
                : 0}
            </p>
            <p className="text-sm text-green-400">+2.3% this week</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Current plan</span>
              <Star className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-xl font-bold">Beta</p>
            <p className="text-sm text-purple-400">50% off forever</p>
          </div>
        </div>

        {/* Competitors */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Competitors</h2>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={competitors.length >= 3}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Competitor</span>
            </button>
          </div>

          {competitors.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
              <Eye className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No competitors tracked yet</h3>
              <p className="text-gray-400 mb-6">Start by adding your main competitors to monitor</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition"
              >
                Add Your First Competitor
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-lg">
                        {competitor.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{competitor.name}</h3>
                        <p className="text-gray-400">{competitor.website}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{competitor.score}</span>
                          <div className={`flex items-center ${competitor.score_change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {competitor.score_change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-sm">{Math.abs(competitor.score_change)}%</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">Activity Score</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Add Competitor</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-300 mb-2">Company Name</div>
                <input
                  type="text"
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none transition"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-300 mb-2">Website</div>
                <input
                  type="text"
                  value={newCompetitor.website}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, website: e.target.value })}
                  placeholder="e.g. acmecorp.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={addCompetitor}
                disabled={!newCompetitor.name || !newCompetitor.website}
                className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Competitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
