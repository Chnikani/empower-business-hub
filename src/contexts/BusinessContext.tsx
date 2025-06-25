
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

interface BusinessAccount {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

interface BusinessContextType {
  currentBusiness: BusinessAccount | null
  businesses: BusinessAccount[]
  setCurrentBusiness: (business: BusinessAccount) => void
  createBusiness: (name: string) => Promise<void>
  refreshBusinesses: () => Promise<void>
  loading: boolean
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export const useBusiness = () => {
  const context = useContext(BusinessContext)
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider')
  }
  return context
}

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [currentBusiness, setCurrentBusiness] = useState<BusinessAccount | null>(null)
  const [businesses, setBusinesses] = useState<BusinessAccount[]>([])
  const [loading, setLoading] = useState(true)

  const refreshBusinesses = async () => {
    if (!user) {
      setBusinesses([])
      setCurrentBusiness(null)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('business_accounts')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching businesses:', error)
      setLoading(false)
      return
    }

    setBusinesses(data || [])
    
    // Set current business to first one if none selected
    if (data && data.length > 0 && !currentBusiness) {
      setCurrentBusiness(data[0])
    }
    
    setLoading(false)
  }

  const createBusiness = async (name: string) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('business_accounts')
      .insert([{ name, owner_id: user.id }])
      .select()
      .single()

    if (error) throw error

    await refreshBusinesses()
    if (data) {
      setCurrentBusiness(data)
    }
  }

  useEffect(() => {
    refreshBusinesses()
  }, [user])

  const value = {
    currentBusiness,
    businesses,
    setCurrentBusiness,
    createBusiness,
    refreshBusinesses,
    loading,
  }

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
}
