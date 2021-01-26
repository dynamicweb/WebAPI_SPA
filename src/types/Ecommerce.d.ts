declare namespace Ecommerce {
  export interface Context {
    CountryCode?: string
    LanguageId?: string | null
    CurrencyCode?: string | null
    ShopId?: string | null
    ShowPricesWithVAT?: boolean | null
  }
  export interface AppContext extends Context {
    updateCurrency: (currencyCode: string) => void
    updateLanguage: (languageId: string) => void
    updateCountry: (countryCode: string) => void
    updateShop: (shopId: string) => void
    updateShowVAT: (showPricesWithVAT: boolean) => void
    getProductListViewModelSettings: () => DW.ProductListViewModelSettings
    getProductViewModelSettings: () => import('../api/DWGenerated').ProductViewModelSettings
  }

  export interface ProductListViewModelSettings {
    ProductSettings?: import('../api/DWGenerated').ProductViewModelSettings | null | undefined
    FacetGroupSettings?: import('../api/DWGenerated').FacetGroupViewModelSettings | null | undefined
    GroupSettings?: import('../api/DWGenerated').ProductGroupViewModelSettings | null | undefined
    Parameters?: { [key: string]: string } | null | undefined
    PageSize?: number | undefined
    CurrentPage?: number | undefined
    MediaSettings?: import('../api/DWGenerated').MediaViewModelSettings | null | undefined
    UserId?: number | undefined
    ShowPricesWithVat?: boolean | undefined
    CurrencyCode?: string | null | undefined
    CountryCode?: string | null
    ShopId?: string | null | undefined
    LanguageId?: string | null | undefined
    FilledProperties?: string[] | null | undefined
  }
}
