import { createContext, SetStateAction, useState } from 'react'
import { ExtendedPurchase, Purchase } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchase[]
  setExtendedPurchases: React.Dispatch<SetStateAction<ExtendedPurchase[]>>
  reset: () => void
  purchasePayment: Purchase[]
  setPurchasePayment: React.Dispatch<SetStateAction<Purchase[]>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null,
  purchasePayment: [],
  setPurchasePayment: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])
  const [profile, setProfile] = useState(initialAppContext.profile)
  const [purchasePayment, setPurchasePayment] = useState(initialAppContext.purchasePayment)

  const reset = () => {
    setIsAuthenticated(false), setExtendedPurchases([]), setProfile(null)
  }

  return (
    <AppContext.Provider
      value={{
        purchasePayment,
        setPurchasePayment,
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
