
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
  error: string | null
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
  const [error, setError] = useState<string | null>(null)

  const refreshBusinesses = async () => {
    if (!user) {
      console.log('No user, clearing business data')
      setBusinesses([])
      setCurrentBusiness(null)
      setError(null)
      setLoading(false)
      return
    }

    try {
      console.log('Fetching businesses for user:', user.id)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('business_accounts')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching businesses:', fetchError)
        setError(`Failed to fetch businesses: ${fetchError.message}`)
        setLoading(false)
        return
      }

      console.log('Fetched businesses:', data)
      setBusinesses(data || [])
      
      // Set current business to first one if none selected
      if (data && data.length > 0 && !currentBusiness) {
        console.log('Setting current business to:', data[0])
        setCurrentBusiness(data[0])
      } else if (!data || data.length === 0) {
        console.log('No businesses found, clearing current business')
        setCurrentBusiness(null)
      }
      
    } catch (err) {
      console.error('Unexpected error in refreshBusinesses:', err)
      setError('An unexpected error occurred while fetching businesses')
    } finally {
      setLoading(false)
    }
  }

  const createBusiness = async (name: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      console.log('Creating business:', name)
      setError(null)

      const { data, error: createError } = await supabase
        .from('business_accounts')
        .insert([{ name, owner_id: user.id }])
        .select()
        .single()

      if (createError) {
        console.error('Error creating business:', createError)
        throw new Error(`Failed to create business: ${createError.message}`)
      }

      console.log('Business created:', data)
      await refreshBusinesses()
      
      if (data) {
        setCurrentBusiness(data)
      }
    } catch (err) {
      console.error('Error in createBusiness:', err)
      throw err
    }
  }

  useEffect(() => {
    console.log('User changed, refreshing businesses')
    refreshBusinesses()
  }, [user])

  const value = {
    currentBusiness,
    businesses,
    setCurrentBusiness,
    createBusiness,
    refreshBusinesses,
    loading,
    error,
  }

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
}
