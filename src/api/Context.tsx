import { createContext, useEffect, useState } from 'react'
import { config } from '../config'
import { AreasClient, ProductListViewModelSettings, ProductViewModelSettings } from './DWGenerated'

const DEFAULT_CONFIGURATION: Ecommerce.Context = {}

const DEFAULT_CONTEXT: Ecommerce.AppContext = {
  updateCurrency: () => {},
  updateLanguage: () => {},
  updateCountry: () => {},
  updateShop: () => {},
  updateShowVAT: () => {},
  getProductListViewModelSettings: () => ({}),
  getProductViewModelSettings: () => ({}),
}

export const EcommerceContext = createContext<Ecommerce.AppContext>(DEFAULT_CONTEXT)

export function useEcomState() {
  const [context, setContext] = useState<Ecommerce.Context>()
  const updateCurrency = (currencyCode: string) =>
    setContext((c) => c && { ...c, CurrencyCode: currencyCode })
  const updateLanguage = (languageId: string) =>
    setContext((c) => c && { ...c, LanguageId: languageId })
  const updateCountry = (countryCode: string) =>
    setContext((c) => c && { ...c, CountryCode: countryCode })
  const updateShop = (shopId: string) => setContext((c) => c && { ...c, ShopId: shopId })
  const updateShowVAT = (showPricesWithVAT: boolean) =>
    setContext((c) => c && { ...c, ShowPricesWithVAT: showPricesWithVAT })
  const getProductListViewModelSettings = () => {
    return context
      ? ({
          CountryCode: context.CountryCode,
          CurrencyCode: context.CurrencyCode,
          LanguageId: context.LanguageId,
          ShopId: context.ShopId,
          Parameters: {},
        } as ProductListViewModelSettings)
      : (DEFAULT_CONFIGURATION as ProductListViewModelSettings)
  }
  const getProductViewModelSettings = () => {
    return context
      ? ({
          CountryCode: context.CountryCode,
          CurrencyCode: context.CurrencyCode,
          LanguageId: context.LanguageId,
          ShopId: context.ShopId,
        } as ProductViewModelSettings)
      : (DEFAULT_CONFIGURATION as ProductViewModelSettings)
  }
  const appContext = context && {
    ...context,
    updateCurrency,
    updateLanguage,
    updateCountry,
    updateShop,
    updateShowVAT,
    getProductListViewModelSettings: getProductListViewModelSettings,
    getProductViewModelSettings: getProductViewModelSettings,
  }
  useEffect(() => {
    InitializeFromWebsite().then((c) => {
      setContext(c)
    })
  }, [])
  return appContext
}

export async function InitializeFromWebsite() {
  const areaClient = new AreasClient()
  const areaId = config.websiteId
  console.log(areaId)
  const area = await areaClient.getById(areaId)
  const result: Ecommerce.Context = {
    CountryCode: area.EcomCountryCode,
    LanguageId: area.EcomLanguageId,
    CurrencyCode: area.EcomCurrencyCode,
    ShopId: area.EcomShopId,
    ShowPricesWithVAT: area.EcomPricesWithVat,
  }
  return result
}
