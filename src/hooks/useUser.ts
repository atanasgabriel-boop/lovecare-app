"use client"

import { useState, useEffect } from 'react'
import { User, PartnerProfile } from '@/lib/types'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento do usuário do localStorage ou API
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('lovecare_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const updateUser = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('lovecare_user', JSON.stringify(updatedUser))
  }

  const updatePartnerProfile = (profile: PartnerProfile) => {
    updateUser({ partnerProfile: profile })
  }

  const subscribe = (plan: 'premium') => {
    updateUser({ 
      isSubscribed: true, 
      subscriptionPlan: plan 
    })
  }

  const login = (email: string) => {
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      isSubscribed: false
    }
    setUser(newUser)
    localStorage.setItem('lovecare_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('lovecare_user')
  }

  return {
    user,
    loading,
    updateUser,
    updatePartnerProfile,
    subscribe,
    login,
    logout
  }
}