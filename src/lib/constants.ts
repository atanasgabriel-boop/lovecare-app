export const APP_CONFIG = {
  name: 'LoveCare',
  description: 'Seu assistente de relacionamento',
  version: '1.0.0',
  subscription: {
    premium: {
      price: 19.90,
      currency: 'BRL',
      features: [
        'Sugestões ilimitadas de presentes com IA',
        'Mediação de conflitos avançada',
        'Desconto de 15% na loja',
        'Lembretes de datas importantes',
        'Sugestões personalizadas diárias'
      ]
    }
  }
}

export const GIFT_CATEGORIES = [
  'Joias e Acessórios',
  'Beleza e Cuidados',
  'Livros e Cultura',
  'Casa e Decoração',
  'Experiências',
  'Moda e Estilo',
  'Tecnologia',
  'Gourmet'
]

export const DATE_TYPES = [
  'Romântico',
  'Aventura',
  'Cultural',
  'Relaxante',
  'Gastronômico',
  'Ativo',
  'Criativo',
  'Luxuoso'
]

export const STYLE_OPTIONS = [
  'Casual',
  'Elegante',
  'Boho',
  'Minimalista',
  'Vintage',
  'Moderno',
  'Clássico',
  'Alternativo'
]

export const OCCASIONS = [
  { value: 'aniversario', label: 'Aniversário' },
  { value: 'namoro', label: 'Aniversário de Namoro' },
  { value: 'valentines', label: 'Dia dos Namorados' },
  { value: 'natal', label: 'Natal' },
  { value: 'pascoa', label: 'Páscoa' },
  { value: 'surpresa', label: 'Surpresa sem motivo' },
  { value: 'pedido-desculpas', label: 'Pedido de Desculpas' },
  { value: 'conquista', label: 'Comemorar Conquista' }
]

export const CONFLICT_TIPS = [
  {
    icon: '💡',
    title: 'Regra de Ouro',
    description: 'Ouça mais do que fale'
  },
  {
    icon: '🤝',
    title: 'Empatia',
    description: 'Tente entender o ponto de vista dela'
  },
  {
    icon: '🎯',
    title: 'Foco',
    description: 'Resolva o problema, não ganhe a discussão'
  },
  {
    icon: '💝',
    title: 'Ação',
    description: 'Demonstre mudança com atitudes'
  }
]