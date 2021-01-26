import * as DW from './DWGenerated'

const client = new DW.ProductsClient()

export function getProduct(id: string, variantId: string, settings: DW.ProductViewModelSettings) {
  return client.getProduct2(
    id,
    variantId,
    settings.PriceSettings,
    settings.MediaSettings,
    settings.ManufacturerSettings,
    settings.CategoryFieldSettings,
    settings.ProductFieldSettings,
    settings.VariantInfoSettings,
    settings.GroupInfoSettings,
    settings.AssetCategorySettings,
    settings.UserId,
    settings.ShowPricesWithVat,
    settings.CurrencyCode,
    settings.CountryCode,
    settings.ShopId,
    settings.LanguageId,
    settings.FilledProperties
  )
}

export function getAll(
  repository: string,
  query: string,
  settings: DW.ProductListViewModelSettings
) {
  return client.getAll(repository, query, undefined, settings)
}
