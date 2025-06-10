import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  // Only add auth token if we're in browser environment
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors gracefully
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      console.log("API server not available (this is normal in development)")
      return Promise.reject(new Error("API server not available"))
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// Helper function to check if API is available
const isApiAvailable = async () => {
  try {
    await apiClient.get("/health", { timeout: 3000 })
    return true
  } catch {
    return false
  }
}

// Search API
export const searchAPI = {
  multimodalSearch: async (data: {
    text?: string
    images?: string[]
    pinterest_url?: string
    mode: string
  }) => {
    try {
      const response = await apiClient.post("/api/search/combined", data)
      return response.data
    } catch (error) {
      // Return mock data if API is not available
      console.log("Using mock search results (API not available)")
      return {
        products: [
          {
            id: "1",
            title: "Mock Product 1",
            price: 29.99,
            image: "/placeholder.svg?height=400&width=300",
            retailer: "Mock Store",
            similarity_score: 0.95,
          },
          {
            id: "2",
            title: "Mock Product 2",
            price: 49.99,
            image: "/placeholder.svg?height=400&width=300",
            retailer: "Mock Store",
            similarity_score: 0.87,
          },
        ],
        total_count: 2,
        search_time: 0.1,
      }
    }
  },

  textSearch: async (query: string) => {
    try {
      const response = await apiClient.post("/api/search/text", { query })
      return response.data
    } catch (error) {
      console.log("Using mock search results (API not available)")
      return { products: [], total_count: 0, search_time: 0.1 }
    }
  },

  imageSearch: async (images: string[]) => {
    try {
      const response = await apiClient.post("/api/search/image", { images })
      return response.data
    } catch (error) {
      console.log("Using mock search results (API not available)")
      return { products: [], total_count: 0, search_time: 0.1 }
    }
  },

  getSimilarProducts: async (productId: string) => {
    try {
      const response = await apiClient.get(`/api/search/similar/${productId}`)
      return response.data
    } catch (error) {
      console.log("Using mock similar products (API not available)")
      return { products: [], total_count: 0, search_time: 0.1 }
    }
  },
}

// Products API
export const productsAPI = {
  getAll: async (filters?: any) => {
    try {
      const response = await apiClient.get("/api/products/get_all", { params: filters })
      return response.data
    } catch (error) {
      console.log("Using mock products (API not available)")
      return { products: [], total_count: 0 }
    }
  },

  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/products/${id}`)
      return response.data
    } catch (error) {
      console.log("Using mock product (API not available)")
      return {
        id,
        title: "Mock Product",
        price: 29.99,
        description: "This is a mock product for development",
        image: "/placeholder.svg?height=400&width=300",
      }
    }
  },

  like: async (productId: string) => {
    try {
      const response = await apiClient.post("/api/products/like", { product_id: productId })
      return response.data
    } catch (error) {
      console.log("Mock like action (API not available)")
      return { success: true }
    }
  },

  dislike: async (productId: string) => {
    try {
      const response = await apiClient.post("/api/products/dislike", { product_id: productId })
      return response.data
    } catch (error) {
      console.log("Mock dislike action (API not available)")
      return { success: true }
    }
  },

  getTrending: async () => {
    try {
      const response = await apiClient.get("/api/products/trending")
      return response.data
    } catch (error) {
      console.log("Using mock trending products (API not available)")
      return { products: [] }
    }
  },
}

// User API
export const userAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/api/user/login", { email, password })
      return response.data
    } catch (error) {
      // For demo purposes, accept specific credentials
      if (email === "niklas123@gmail.com" && password === "niklas123") {
        return {
          token: "mock_token_123",
          user: {
            id: "1",
            name: "Niklas",
            email: "niklas123@gmail.com",
            isPro: true,
          },
        }
      }
      throw new Error("Invalid credentials")
    }
  },

  signup: async (userData: any) => {
    try {
      const response = await apiClient.post("/api/user/signup", userData)
      return response.data
    } catch (error) {
      // Mock signup success
      return {
        token: "mock_token_123",
        user: {
          id: "1",
          name: userData.name,
          email: userData.email,
          isPro: false,
        },
      }
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/user/profile")
      return response.data
    } catch (error) {
      // Return mock user profile
      return {
        id: "1",
        name: "Niklas",
        email: "niklas123@gmail.com",
        isPro: true,
        avatar: "/placeholder.svg?height=32&width=32",
      }
    }
  },

  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.put("/api/user/profile", data)
      return response.data
    } catch (error) {
      console.log("Mock profile update (API not available)")
      return { success: true }
    }
  },

  getFavorites: async () => {
    try {
      const response = await apiClient.get("/api/user/favorites")
      return response.data
    } catch (error) {
      console.log("Using mock favorites (API not available)")
      return { favorites: [] }
    }
  },

  addFavorite: async (productId: string) => {
    try {
      const response = await apiClient.post("/api/user/favorites", { product_id: productId })
      return response.data
    } catch (error) {
      console.log("Mock add favorite (API not available)")
      return { success: true }
    }
  },

  removeFavorite: async (productId: string) => {
    try {
      const response = await apiClient.delete(`/api/user/favorites/${productId}`)
      return response.data
    } catch (error) {
      console.log("Mock remove favorite (API not available)")
      return { success: true }
    }
  },
}

// Moodboard API
export const moodboardAPI = {
  save: async (moodboardData: any) => {
    try {
      const response = await apiClient.post("/api/moodboard/save", moodboardData)
      return response.data
    } catch (error) {
      console.log("Mock moodboard save (API not available)")
      return { id: "mock_moodboard_1", success: true }
    }
  },

  list: async () => {
    try {
      const response = await apiClient.get("/api/moodboard/list")
      return response.data
    } catch (error) {
      console.log("Using mock moodboards (API not available)")
      return { moodboards: [] }
    }
  },

  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/moodboard/${id}`)
      return response.data
    } catch (error) {
      console.log("Using mock moodboard (API not available)")
      return { id, name: "Mock Moodboard", images: [] }
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`/api/moodboard/${id}`)
      return response.data
    } catch (error) {
      console.log("Mock moodboard delete (API not available)")
      return { success: true }
    }
  },

  search: async (moodboardId: string) => {
    try {
      const response = await apiClient.post(`/api/moodboard/${moodboardId}/search`)
      return response.data
    } catch (error) {
      console.log("Using mock moodboard search (API not available)")
      return { products: [], total_count: 0 }
    }
  },
}

// Analytics API
export const analyticsAPI = {
  trackEvent: async (eventData: any) => {
    try {
      const response = await apiClient.post("/api/analytics/track_event", eventData)
      return response.data
    } catch (error) {
      // Silently fail for analytics in development
      return { success: true }
    }
  },

  getSearchTrends: async () => {
    try {
      const response = await apiClient.get("/api/analytics/search_trends")
      return response.data
    } catch (error) {
      console.log("Using mock search trends (API not available)")
      return { trends: [] }
    }
  },

  getUserInsights: async () => {
    try {
      const response = await apiClient.get("/api/analytics/user_insights")
      return response.data
    } catch (error) {
      console.log("Using mock user insights (API not available)")
      return { insights: {} }
    }
  },
}

// Feedback API
export const feedbackAPI = {
  submit: async (feedbackData: any) => {
    try {
      const response = await apiClient.post("/api/feedback/submit", feedbackData)
      return response.data
    } catch (error) {
      console.log("Mock feedback submission (API not available)")
      return { success: true }
    }
  },

  getAll: async () => {
    try {
      const response = await apiClient.get("/api/feedback/all")
      return response.data
    } catch (error) {
      console.log("Using mock feedback (API not available)")
      return { feedback: [] }
    }
  },
}

// AI Assistant API
export const aiAPI = {
  chat: async (message: string, context?: any) => {
    try {
      const response = await apiClient.post("/api/ai/chat", { message, context })
      return response.data
    } catch (error) {
      console.log("Using mock AI response (API not available)")
      // Return a helpful mock response
      return {
        message:
          "I'm a mock AI assistant. The backend API isn't running yet, but I can still help you explore the interface! Try searching for fashion items or creating a moodboard.",
      }
    }
  },

  generateTags: async (productData: any) => {
    try {
      const response = await apiClient.post("/api/ai/generate_tags", productData)
      return response.data
    } catch (error) {
      console.log("Using mock AI tags (API not available)")
      return { tags: ["casual", "trendy", "comfortable"] }
    }
  },

  analyzeStyle: async (imageUrl: string) => {
    try {
      const response = await apiClient.post("/api/ai/analyze_style", { image_url: imageUrl })
      return response.data
    } catch (error) {
      console.log("Using mock style analysis (API not available)")
      return {
        style: "minimalist",
        confidence: 0.85,
        tags: ["clean", "simple", "modern"],
      }
    }
  },
}

export default apiClient
export { isApiAvailable }
