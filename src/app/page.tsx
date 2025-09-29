"use client"

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Heart, Gift, MessageCircle, MapPin, ShoppingBag, User, Settings, Crown, Star, Calendar, Sparkles, Search, Navigation, Save, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { userService, interactionService } from '@/lib/database'

export default function LoveCare() {
  const [activeTab, setActiveTab] = useState('home')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [flowerShops, setFlowerShops] = useState([])
  const [isSearchingShops, setIsSearchingShops] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Estado do perfil da parceira - CENTRO DE TUDO
  const [partnerProfile, setPartnerProfile] = useState({
    name: '',
    age: '',
    style: '',
    interests: '',
    favoriteInfluencers: '',
    preferredColors: '',
    hobbies: '',
    personalityType: '',
    favoriteFlowers: '',
    allergies: '',
    preferredGifts: '',
    relationshipGoals: '',
    communicationStyle: '',
    loveLanguage: ''
  })

  // Verificar usuário autenticado ao carregar
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUser(user)
        // Carregar perfil da parceira se existir
        try {
          const userData = await userService.getUserById(user.id)
          if (userData) {
            // Carregar dados do perfil da parceira (assumindo que estão em campos customizados)
            setPartnerProfile(prev => ({
              ...prev,
              name: userData.partner_name || '',
              age: userData.partner_age || '',
              style: userData.partner_style || '',
              interests: userData.partner_interests || '',
              favoriteInfluencers: userData.partner_influencers || '',
              preferredColors: userData.partner_colors || '',
              hobbies: userData.partner_hobbies || '',
              personalityType: userData.partner_personality || '',
              favoriteFlowers: userData.partner_flowers || '',
              allergies: userData.partner_allergies || '',
              communicationStyle: userData.partner_communication || '',
              loveLanguage: userData.partner_love_language || ''
            }))
            setIsSubscribed(userData.subscription_type === 'premium')
          }
        } catch (error) {
          console.log('Usuário ainda não tem perfil salvo')
        }
      }
    }
    checkUser()
  }, [])

  // Função otimizada para atualizar perfil - CORRIGIDA
  const updatePartnerProfile = useCallback((field, value) => {
    setPartnerProfile(prevProfile => ({
      ...prevProfile,
      [field]: value
    }))
  }, [])

  // Função para salvar perfil no Supabase
  const savePartnerProfile = async () => {
    if (!currentUser) {
      // Se não há usuário, criar um usuário temporário ou pedir login
      alert('Faça login para salvar o perfil da sua parceira')
      return
    }

    setIsSaving(true)
    try {
      // Salvar perfil da parceira no banco
      await userService.upsertUser({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.user_metadata?.name || currentUser.email,
        partner_name: partnerProfile.name,
        partner_age: partnerProfile.age,
        partner_style: partnerProfile.style,
        partner_interests: partnerProfile.interests,
        partner_influencers: partnerProfile.favoriteInfluencers,
        partner_colors: partnerProfile.preferredColors,
        partner_hobbies: partnerProfile.hobbies,
        partner_personality: partnerProfile.personalityType,
        partner_flowers: partnerProfile.favoriteFlowers,
        partner_allergies: partnerProfile.allergies,
        partner_communication: partnerProfile.communicationStyle,
        partner_love_language: partnerProfile.loveLanguage
      })

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  // Função para salvar interação com IA
  const saveInteraction = async (aiType, message, response) => {
    if (!currentUser) return

    try {
      await interactionService.createInteraction({
        user_id: currentUser.id,
        ai_type: aiType,
        message: message,
        response: response
      })
    } catch (error) {
      console.error('Erro ao salvar interação:', error)
    }
  }

  // Função para buscar floriculturas baseado no endereço
  const searchFlowerShops = async () => {
    if (!deliveryAddress.trim()) return
    
    setIsSearchingShops(true)
    
    // Simulação de busca por floriculturas (em produção seria uma API real)
    setTimeout(() => {
      const mockShops = [
        {
          name: "Flora Bella",
          distance: "0.8 km",
          rating: 4.9,
          price: "R$ 45-120",
          delivery: "30-45 min",
          specialties: ["Rosas", "Arranjos personalizados"],
          phone: "(11) 99999-1234",
          address: "Rua das Flores, 123",
          image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=200&fit=crop"
        },
        {
          name: "Jardim Secreto",
          distance: "1.2 km", 
          rating: 4.8,
          price: "R$ 35-95",
          delivery: "45-60 min",
          specialties: ["Buquês", "Plantas ornamentais"],
          phone: "(11) 99999-5678",
          address: "Av. Primavera, 456",
          image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=200&fit=crop"
        },
        {
          name: "Pétalas & Cia",
          distance: "1.5 km",
          rating: 4.7,
          price: "R$ 50-150",
          delivery: "60-90 min",
          specialties: ["Flores importadas", "Cestas especiais"],
          phone: "(11) 99999-9012",
          address: "Rua Botânica, 789",
          image: "https://images.unsplash.com/photo-1597848212624-e6ec2d17524e?w=300&h=200&fit=crop"
        },
        {
          name: "Flor de Lótus",
          distance: "2.1 km",
          rating: 4.6,
          price: "R$ 40-110",
          delivery: "90-120 min",
          specialties: ["Orquídeas", "Arranjos zen"],
          phone: "(11) 99999-3456",
          address: "Praça das Rosas, 321",
          image: "https://images.unsplash.com/photo-1452827073306-6e6e661baf57?w=300&h=200&fit=crop"
        }
      ]
      
      setFlowerShops(mockShops)
      setIsSearchingShops(false)
    }, 2000)
  }

  // Função para gerar sugestões baseadas no perfil
  const generatePersonalizedSuggestions = useCallback((type) => {
    if (!partnerProfile.name) {
      return "Configure primeiro o perfil da sua parceira para receber sugestões personalizadas!"
    }
    
    const profile = partnerProfile
    let suggestions = ""
    
    switch(type) {
      case 'gifts':
        suggestions = `**Sugestões personalizadas para ${profile.name}:**\n\n`
        if (profile.style === 'minimalista') {
          suggestions += "• Colar delicado com pingente geométrico\n• Vela aromática em recipiente de vidro clean\n• Agenda minimalista em couro\n"
        }
        if (profile.interests.includes('yoga')) {
          suggestions += "• Kit de yoga premium com tapete personalizado\n• Óleos essenciais para relaxamento\n• Almofada de meditação\n"
        }
        if (profile.loveLanguage === 'presentes') {
          suggestions += "• Caixa surpresa mensal personalizada\n• Joia com gravação especial\n• Kit de skincare dos influenciadores que ela segue\n"
        }
        break
        
      case 'conflicts':
        suggestions = `**Estratégia personalizada baseada no perfil de ${profile.name}:**\n\n`
        if (profile.communicationStyle === 'direta') {
          suggestions += "• Seja direto e honesto, ela valoriza transparência\n• Evite rodeios, vá direto ao ponto\n• Apresente soluções concretas\n"
        }
        if (profile.personalityType === 'sensível') {
          suggestions += "• Use tom mais suave e empático\n• Valide os sentimentos dela primeiro\n• Dê tempo para ela processar\n"
        }
        if (profile.loveLanguage === 'palavras de afirmação') {
          suggestions += "• Reforce o quanto ela é importante\n• Use frases de reconhecimento\n• Seja específico nos elogios\n"
        }
        break
        
      case 'dates':
        suggestions = `**Encontros ideais para ${profile.name}:**\n\n`
        if (profile.interests.includes('arte')) {
          suggestions += "• Visita a galeria de arte seguida de jantar\n• Aula de pintura para casais\n• Tour por ateliês locais\n"
        }
        if (profile.hobbies.includes('culinária')) {
          suggestions += "• Aula de culinária do país favorito dela\n• Degustação de vinhos\n• Mercado gastronômico\n"
        }
        if (profile.style === 'aventureira') {
          suggestions += "• Trilha com piquenique no final\n• Escalada indoor\n• Passeio de bike por rota cênica\n"
        }
        break
    }
    
    return suggestions || "Configure mais detalhes no perfil para sugestões mais precisas!"
  }, [partnerProfile])

  // Componente de Header
  const Header = () => (
    <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-b-3xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">LoveCare</h1>
            <p className="text-pink-100">
              {partnerProfile.name ? `Personalizado para ${partnerProfile.name}` : 'Configure o perfil da sua parceira'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <Badge className="bg-yellow-500 text-yellow-900">
              <Crown className="w-4 h-4 mr-1" />
              Premium
            </Badge>
          ) : (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setIsSubscribed(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Assinar Premium
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )

  // Componente de Navegação
  const NavigationBar = () => (
    <div className="bg-white shadow-lg rounded-t-3xl -mt-6 relative z-10">
      <div className="flex justify-around p-4">
        {[
          { id: 'home', icon: Heart, label: 'Início' },
          { id: 'gifts', icon: Gift, label: 'Presentes' },
          { id: 'conflicts', icon: MessageCircle, label: 'Mediação' },
          { id: 'dates', icon: MapPin, label: 'Encontros' },
          { id: 'store', icon: ShoppingBag, label: 'Flores' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === id 
                ? 'bg-gradient-to-b from-pink-500 to-rose-600 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  // Componente de Input Memoizado para evitar re-renderizações
  const MemoizedInput = useMemo(() => {
    return ({ id, label, placeholder, value, field, type = "text" }) => (
      <div>
        <Label htmlFor={id}>{label}</Label>
        <Input 
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => updatePartnerProfile(field, e.target.value)}
        />
      </div>
    )
  }, [updatePartnerProfile])

  // Componente de Select Memoizado
  const MemoizedSelect = useMemo(() => {
    return ({ label, placeholder, field, options }) => (
      <div>
        <Label>{label}</Label>
        <Select onValueChange={(value) => updatePartnerProfile(field, value)}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }, [updatePartnerProfile])

  // Tela Inicial - PERFIL DA PARCEIRA COMO CENTRO
  const HomeScreen = () => (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {partnerProfile.name ? `Olá! Vamos cuidar da ${partnerProfile.name}?` : 'Configure o Perfil da Sua Parceira'}
        </h2>
        <p className="text-gray-600">
          {partnerProfile.name ? 'Todas as IAs estão personalizadas para ela' : 'Todas as funcionalidades se adaptarão ao perfil dela'}
        </p>
      </div>

      {/* PERFIL DA PARCEIRA - PRIORIDADE MÁXIMA */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <User className="w-5 h-5" />
            Perfil da Parceira - Centro de Tudo
          </CardTitle>
          <CardDescription>
            {partnerProfile.name ? 'Perfil configurado! Todas as IAs usam essas informações.' : 'Configure para personalizar TODAS as funcionalidades'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MemoizedInput 
              id="name"
              label="Nome *"
              placeholder="Nome da sua parceira"
              value={partnerProfile.name}
              field="name"
            />
            <MemoizedInput 
              id="age"
              label="Idade"
              placeholder="Ex: 25"
              value={partnerProfile.age}
              field="age"
            />
            <MemoizedSelect 
              label="Estilo"
              placeholder="Selecione o estilo"
              field="style"
              options={[
                { value: 'casual', label: 'Casual' },
                { value: 'elegante', label: 'Elegante' },
                { value: 'boho', label: 'Boho' },
                { value: 'minimalista', label: 'Minimalista' },
                { value: 'vintage', label: 'Vintage' },
                { value: 'aventureira', label: 'Aventureira' }
              ]}
            />
            <MemoizedSelect 
              label="Linguagem do Amor"
              placeholder="Como ela demonstra amor?"
              field="loveLanguage"
              options={[
                { value: 'presentes', label: 'Presentes' },
                { value: 'tempo', label: 'Tempo de Qualidade' },
                { value: 'palavras', label: 'Palavras de Afirmação' },
                { value: 'toque', label: 'Toque Físico' },
                { value: 'servicos', label: 'Atos de Serviço' }
              ]}
            />
            <MemoizedSelect 
              label="Estilo de Comunicação"
              placeholder="Como ela se comunica?"
              field="communicationStyle"
              options={[
                { value: 'direta', label: 'Direta' },
                { value: 'indireta', label: 'Indireta' },
                { value: 'emocional', label: 'Emocional' },
                { value: 'racional', label: 'Racional' }
              ]}
            />
            <MemoizedSelect 
              label="Personalidade"
              placeholder="Como ela é?"
              field="personalityType"
              options={[
                { value: 'extrovertida', label: 'Extrovertida' },
                { value: 'introvertida', label: 'Introvertida' },
                { value: 'sensível', label: 'Sensível' },
                { value: 'prática', label: 'Prática' },
                { value: 'sonhadora', label: 'Sonhadora' }
              ]}
            />
          </div>
          
          <MemoizedInput 
            id="interests"
            label="Interesses e Hobbies"
            placeholder="Ex: yoga, leitura, culinária, arte, viagens, música"
            value={partnerProfile.interests}
            field="interests"
          />
          
          <MemoizedInput 
            id="influencers"
            label="Influenciadores Favoritos"
            placeholder="Ex: @influencer1, @influencer2 (para sugestões de presentes)"
            value={partnerProfile.favoriteInfluencers}
            field="favoriteInfluencers"
          />
          
          <MemoizedInput 
            id="flowers"
            label="Flores Favoritas"
            placeholder="Ex: rosas vermelhas, girassóis, orquídeas"
            value={partnerProfile.favoriteFlowers}
            field="favoriteFlowers"
          />
          
          <MemoizedInput 
            id="allergies"
            label="Alergias (importante para flores/presentes)"
            placeholder="Ex: pólen, perfumes, látex"
            value={partnerProfile.allergies}
            field="allergies"
          />
          
          <Button 
            onClick={savePartnerProfile}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvo com Sucesso!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {partnerProfile.name ? 'Atualizar Perfil' : 'Salvar Perfil'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Funcionalidades Adaptativas */}
      {partnerProfile.name && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-700">
                <Gift className="w-5 h-5" />
                Presentes para {partnerProfile.name}
              </CardTitle>
              <CardDescription>IA adaptada ao estilo {partnerProfile.style} dela</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveTab('gifts')} 
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              >
                Sugestões Personalizadas
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <MessageCircle className="w-5 h-5" />
                Mediação Personalizada
              </CardTitle>
              <CardDescription>Baseada no perfil de comunicação dela</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveTab('conflicts')} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Resolver Conflitos
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <MapPin className="w-5 h-5" />
                Encontros para {partnerProfile.name}
              </CardTitle>
              <CardDescription>Baseados nos interesses: {partnerProfile.interests}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveTab('dates')} 
                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
              >
                Planejar Encontro
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <ShoppingBag className="w-5 h-5" />
                Flores para {partnerProfile.name}
              </CardTitle>
              <CardDescription>Busca inteligente por localização</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveTab('store')} 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Encontrar Floriculturas
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  // Tela de Sugestões de Presentes - ADAPTATIVA
  const GiftsScreen = () => {
    const [aiSuggestions, setAiSuggestions] = useState('')
    const [occasion, setOccasion] = useState('')
    
    const generateGiftSuggestions = async () => {
      const suggestions = generatePersonalizedSuggestions('gifts')
      setAiSuggestions(suggestions)
      
      // Salvar interação no banco
      await saveInteraction('girlfriend', `Gerar sugestões de presentes para ${occasion}`, suggestions)
    }

    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {partnerProfile.name ? `Presentes para ${partnerProfile.name}` : 'Sugestões de Presentes'}
          </h2>
          <p className="text-gray-600">
            {partnerProfile.name ? 'IA personalizada baseada no perfil dela' : 'Configure o perfil para sugestões personalizadas'}
          </p>
        </div>

        {partnerProfile.name ? (
          <>
            <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-700">
                  <Sparkles className="w-5 h-5" />
                  IA Personalizada para {partnerProfile.name}
                </CardTitle>
                <CardDescription>
                  Estilo: {partnerProfile.style} | Linguagem do Amor: {partnerProfile.loveLanguage}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={setOccasion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a ocasião" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aniversario">Aniversário</SelectItem>
                    <SelectItem value="namoro">Aniversário de Namoro</SelectItem>
                    <SelectItem value="valentines">Dia dos Namorados</SelectItem>
                    <SelectItem value="natal">Natal</SelectItem>
                    <SelectItem value="surpresa">Surpresa sem motivo</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={generateGiftSuggestions}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600"
                  disabled={!occasion}
                >
                  Gerar Sugestões Personalizadas
                </Button>
              </CardContent>
            </Card>

            {aiSuggestions && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Sparkles className="w-5 h-5" />
                    Sugestões Personalizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {aiSuggestions.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 text-gray-700">
                        {line.startsWith('**') ? (
                          <strong className="text-green-800">{line.replace(/\*\*/g, '')}</strong>
                        ) : line.startsWith('•') ? (
                          <span className="ml-4">{line}</span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Configure o Perfil Primeiro</h3>
              <p className="text-gray-600 mb-4">Para receber sugestões personalizadas, configure o perfil da sua parceira na tela inicial.</p>
              <Button onClick={() => setActiveTab('home')} variant="outline">
                Ir para Perfil
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Tela de Mediação de Conflitos - ADAPTATIVA
  const ConflictsScreen = () => {
    const [situation, setSituation] = useState('')
    const [aiResponse, setAiResponse] = useState('')

    const handleAnalyze = async () => {
      if (!partnerProfile.name) {
        setAiResponse("Configure primeiro o perfil da sua parceira para receber orientações personalizadas!")
        return
      }
      
      const personalizedResponse = generatePersonalizedSuggestions('conflicts')
      const fullResponse = `
        ${personalizedResponse}
        
        **Análise da Situação Específica:**
        
        **O que fazer considerando o perfil de ${partnerProfile.name}:**
        • Ouça ativamente sem interromper
        • Valide os sentimentos dela: "Entendo que você se sentiu..."
        • Assuma responsabilidade pelos seus erros
        • Proponha uma solução juntos
        
        **Frases recomendadas para ${partnerProfile.name}:**
        • "Você tem razão, eu deveria ter..."
        • "Como posso melhorar isso?"
        • "Seus sentimentos são importantes para mim"
        
        **Evite dizer:**
        • "Você está exagerando"
        • "Sempre a mesma coisa"
        • "Não foi isso que eu quis dizer"
        
        **Próximos passos personalizados:**
        1. Peça desculpas sinceras
        2. Demonstre mudança com ações
        3. ${partnerProfile.loveLanguage === 'presentes' ? 'Considere um presente significativo' : 
             partnerProfile.loveLanguage === 'tempo' ? 'Planeje tempo de qualidade juntos' :
             'Demonstre amor na linguagem que ela valoriza'}
      `
      
      setAiResponse(fullResponse)
      
      // Salvar interação no banco
      await saveInteraction('therapist', situation, fullResponse)
    }

    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {partnerProfile.name ? `Mediação Personalizada para ${partnerProfile.name}` : 'Mediação de Conflitos'}
          </h2>
          <p className="text-gray-600">
            {partnerProfile.name ? `Baseada no perfil de comunicação: ${partnerProfile.communicationStyle}` : 'Configure o perfil para orientações personalizadas'}
          </p>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <MessageCircle className="w-5 h-5" />
              Descreva a Situação
            </CardTitle>
            <CardDescription>
              {partnerProfile.name ? `A IA conhece o perfil de ${partnerProfile.name} e dará conselhos específicos` : 'Configure o perfil para conselhos personalizados'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ex: Esqueci o aniversário dela e ela ficou muito chateada. Ela disse que eu não me importo com datas importantes..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={handleAnalyze}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
              disabled={!situation.trim()}
            >
              {partnerProfile.name ? `Analisar com IA Personalizada` : 'Analisar Situação'}
            </Button>
          </CardContent>
        </Card>

        {aiResponse && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Sparkles className="w-5 h-5" />
                {partnerProfile.name ? `Orientação Personalizada para ${partnerProfile.name}` : 'Orientação Geral'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {aiResponse.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 text-gray-700">
                    {line.startsWith('**') ? (
                      <strong className="text-green-800">{line.replace(/\*\*/g, '')}</strong>
                    ) : line.startsWith('•') ? (
                      <span className="ml-4">{line}</span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Tela de Sugestões de Encontros - ADAPTATIVA
  const DatesScreen = () => {
    const [aiSuggestions, setAiSuggestions] = useState('')
    
    const generateDateSuggestions = async () => {
      const suggestions = generatePersonalizedSuggestions('dates')
      setAiSuggestions(suggestions)
      
      // Salvar interação no banco
      await saveInteraction('friend', 'Gerar sugestões de encontros', suggestions)
    }

    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {partnerProfile.name ? `Encontros para ${partnerProfile.name}` : 'Ideias de Encontros'}
          </h2>
          <p className="text-gray-600">
            {partnerProfile.name ? `Baseados nos interesses: ${partnerProfile.interests}` : 'Configure o perfil para sugestões personalizadas'}
          </p>
        </div>

        {partnerProfile.name ? (
          <>
            <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Calendar className="w-5 h-5" />
                  Encontros Personalizados para {partnerProfile.name}
                </CardTitle>
                <CardDescription>
                  Estilo: {partnerProfile.style} | Interesses: {partnerProfile.interests}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={generateDateSuggestions}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600"
                >
                  Gerar Ideias Personalizadas
                </Button>
              </CardContent>
            </Card>

            {aiSuggestions && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Sparkles className="w-5 h-5" />
                    Encontros Ideais para {partnerProfile.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {aiSuggestions.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 text-gray-700">
                        {line.startsWith('**') ? (
                          <strong className="text-green-800">{line.replace(/\*\*/g, '')}</strong>
                        ) : line.startsWith('•') ? (
                          <span className="ml-4">{line}</span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Configure o Perfil Primeiro</h3>
              <p className="text-gray-600 mb-4">Para receber sugestões de encontros personalizadas, configure o perfil da sua parceira.</p>
              <Button onClick={() => setActiveTab('home')} variant="outline">
                Ir para Perfil
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Tela da Loja - FOCO EM FLORES COM BUSCA POR LOCALIZAÇÃO
  const StoreScreen = () => (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {partnerProfile.name ? `Melhores Flores para ${partnerProfile.name}` : 'Melhores Lugares para Comprar Flores'}
        </h2>
        <p className="text-gray-600">
          {partnerProfile.name && partnerProfile.favoriteFlowers ? 
            `Flores favoritas: ${partnerProfile.favoriteFlowers}` : 
            'IA busca os melhores preços na sua região'}
        </p>
      </div>

      {/* Sistema de Busca por Localização */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Navigation className="w-5 h-5" />
            Buscar Floriculturas por Localização
          </CardTitle>
          <CardDescription>
            Informe o endereço de entrega e a IA encontrará os melhores lugares com melhores preços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Endereço de Entrega</Label>
            <Input 
              id="address"
              placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>
          <Button 
            onClick={searchFlowerShops}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
            disabled={!deliveryAddress.trim() || isSearchingShops}
          >
            {isSearchingShops ? (
              <>
                <Search className="w-4 h-4 mr-2 animate-spin" />
                Buscando melhores opções...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Buscar Floriculturas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados da Busca */}
      {flowerShops.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Melhores Opções Encontradas</h3>
          </div>
          
          {flowerShops.map((shop, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-emerald-200">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={shop.image} 
                    alt={shop.name} 
                    className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
                  />
                </div>
                <div className="md:w-2/3 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{shop.name}</h3>
                      <p className="text-sm text-gray-600">{shop.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{shop.rating}</span>
                      </div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                        {shop.distance}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Faixa de preço:</span>
                      <span className="font-medium text-emerald-600">{shop.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tempo de entrega:</span>
                      <span className="font-medium">{shop.delivery}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Especialidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {shop.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600"
                      size="sm"
                    >
                      Ver Catálogo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      Ligar: {shop.phone}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sugestões baseadas no perfil */}
      {partnerProfile.name && partnerProfile.favoriteFlowers && (
        <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Heart className="w-5 h-5" />
              Recomendações para {partnerProfile.name}
            </CardTitle>
            <CardDescription>
              Baseado nas flores favoritas: {partnerProfile.favoriteFlowers}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">💡 <strong>Dica personalizada:</strong> Ela adora {partnerProfile.favoriteFlowers}</p>
              {partnerProfile.allergies && (
                <p className="text-red-600">⚠️ <strong>Atenção:</strong> Evite flores que possam causar alergia: {partnerProfile.allergies}</p>
              )}
              <p className="text-gray-700">🎨 <strong>Cores preferidas:</strong> {partnerProfile.preferredColors || 'Configure no perfil'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não há busca */}
      {flowerShops.length === 0 && !isSearchingShops && (
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <CardContent className="p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Informe o Endereço de Entrega</h3>
            <p className="text-gray-600">A IA buscará as melhores floriculturas na sua região com os melhores preços e avaliações.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      
      <div className="pb-6">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'gifts' && <GiftsScreen />}
        {activeTab === 'conflicts' && <ConflictsScreen />}
        {activeTab === 'dates' && <DatesScreen />}
        {activeTab === 'store' && <StoreScreen />}
      </div>

      {/* Modal de Assinatura Premium */}
      <Dialog>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              LoveCare Premium
            </DialogTitle>
            <DialogDescription>
              Desbloqueie todas as funcionalidades e tenha acesso ilimitado à IA personalizada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">Benefícios Premium:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>✨ IAs completamente personalizadas para sua parceira</li>
                <li>🤝 Mediação de conflitos avançada e adaptativa</li>
                <li>💝 Busca inteligente de floriculturas por localização</li>
                <li>📱 Lembretes de datas importantes</li>
                <li>🎯 Sugestões diárias baseadas no perfil dela</li>
                <li>🌹 Desconto de 15% em flores e presentes</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">R$ 19,90</div>
              <div className="text-sm text-gray-600">por mês</div>
            </div>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700">
              Assinar Premium
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Cancele a qualquer momento. Primeiro mês grátis.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}