import { PartnerProfile, ConflictAnalysis } from './types'

// Simulação de API de IA para sugestões de presentes
export async function generateGiftSuggestions(
  profile: PartnerProfile,
  occasion: string,
  budget?: string
) {
  // Em produção, aqui seria uma chamada para OpenAI GPT
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: "Colar Personalizado",
          price: "R$ 89,90",
          description: `Colar com inicial de ${profile.name}, estilo ${profile.style}`,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"
        },
        {
          title: "Kit Skincare Premium",
          price: "R$ 156,00",
          description: `Baseado nos influenciadores: ${profile.favoriteInfluencers}`,
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop"
        }
      ])
    }, 1500)
  })
}

// Simulação de API de IA para mediação de conflitos
export async function analyzeConflict(situation: string): Promise<ConflictAnalysis> {
  // Em produção, aqui seria uma chamada para OpenAI GPT
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        situation,
        recommendations: [
          "Ouça ativamente sem interromper",
          "Valide os sentimentos dela",
          "Assuma responsabilidade pelos seus erros",
          "Proponha uma solução juntos"
        ],
        phrasesToUse: [
          "Você tem razão, eu deveria ter...",
          "Como posso melhorar isso?",
          "Seus sentimentos são importantes para mim"
        ],
        phrasesToAvoid: [
          "Você está exagerando",
          "Sempre a mesma coisa",
          "Não foi isso que eu quis dizer"
        ],
        nextSteps: [
          "Peça desculpas sinceras",
          "Demonstre mudança com ações",
          "Planeje algo especial para reconectar"
        ]
      })
    }, 2000)
  })
}

// Simulação de API para sugestões de encontros
export async function generateDateIdeas(
  profile: PartnerProfile,
  type: string,
  location?: string
) {
  // Em produção, aqui seria uma chamada para API de lugares + IA
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: "Piquenique no Parque",
          type: "Romântico",
          duration: "3-4 horas",
          cost: "R$ 80-120",
          description: `Piquenique personalizado com ${profile.interests}`,
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        }
      ])
    }, 1000)
  })
}

// Simulação de integração com Stripe
export async function createSubscription(userId: string, plan: 'premium') {
  // Em produção, aqui seria uma chamada para Stripe API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 9),
        status: 'active',
        plan,
        amount: 1990, // R$ 19,90 em centavos
        currency: 'BRL'
      })
    }, 1500)
  })
}

// Simulação de integração com e-commerce
export async function processOrder(items: any[], userId: string) {
  // Em produção, aqui seria integração com marketplace de flores/presentes
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId: 'order_' + Math.random().toString(36).substr(2, 9),
        status: 'confirmed',
        estimatedDelivery: '2-4 horas',
        total: items.reduce((sum, item) => sum + parseFloat(item.price.replace('R$ ', '').replace(',', '.')), 0)
      })
    }, 1000)
  })
}