import { supabase } from './supabase'
import type { User, Interaction, Subscription } from './supabase'

// Tipo estendido para usuário com perfil da parceira
export interface ExtendedUser extends User {
  partner_name?: string
  partner_age?: string
  partner_style?: string
  partner_interests?: string
  partner_influencers?: string
  partner_colors?: string
  partner_hobbies?: string
  partner_personality?: string
  partner_flowers?: string
  partner_allergies?: string
  partner_communication?: string
  partner_love_language?: string
}

// Funções para usuários
export const userService = {
  // Criar ou atualizar usuário
  async upsertUser(userData: Partial<ExtendedUser>) {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar usuário por ID
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar tipo de assinatura
  async updateSubscriptionType(userId: string, subscriptionType: 'free' | 'premium') {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_type: subscriptionType })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Funções para interações
export const interactionService = {
  // Criar nova interação
  async createInteraction(interactionData: Omit<Interaction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('interactions')
      .insert(interactionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar interações do usuário
  async getUserInteractions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Buscar interações por tipo de IA
  async getInteractionsByType(userId: string, aiType: Interaction['ai_type']) {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('user_id', userId)
      .eq('ai_type', aiType)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Funções para assinaturas
export const subscriptionService = {
  // Criar nova assinatura
  async createSubscription(subscriptionData: Omit<Subscription, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar assinatura ativa do usuário
  async getActiveSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  },

  // Atualizar status da assinatura
  async updateSubscriptionStatus(subscriptionId: string, status: Subscription['status']) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status })
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Verificar se usuário tem assinatura premium ativa
  async hasActivePremium(userId: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId)
    return subscription !== null && new Date(subscription.expires_at) > new Date()
  }
}