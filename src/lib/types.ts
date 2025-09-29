export interface PartnerProfile {
  name: string
  style: string
  interests: string
  favoriteInfluencers: string
  preferredColors: string
  hobbies: string
}

export interface Gift {
  title: string
  price: string
  description: string
  rating: number
  image: string
  category?: string
}

export interface DateIdea {
  title: string
  type: string
  duration: string
  cost: string
  description: string
  image: string
}

export interface Product {
  name: string
  price: string
  delivery?: string
  category?: string
  image: string
}

export interface Combo extends Product {
  originalPrice: string
  items: string
}

export interface ConflictAnalysis {
  situation: string
  recommendations: string[]
  phrasesToUse: string[]
  phrasesToAvoid: string[]
  nextSteps: string[]
}

export type TabType = 'home' | 'gifts' | 'conflicts' | 'dates' | 'store'

export interface User {
  id: string
  email: string
  isSubscribed: boolean
  subscriptionPlan?: 'basic' | 'premium'
  partnerProfile?: PartnerProfile
}