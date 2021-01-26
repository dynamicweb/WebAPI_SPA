import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EcommerceContext } from '../api/Context'
import * as DW from '../api/DWGenerated'
import * as Products from '../api/Products'
import { Spinner } from './Common'
import { GetImage } from './Image'

export function ProductList({ repository, query }: { repository: string; query: string }) {
  const [productList, setProducts] = useState<DW.ProductListViewModel>()
  const state = useContext(EcommerceContext)
  const [settings, setSearchSettings] = useState<DW.ProductListViewModelSettings>(
    state.getProductListViewModelSettings()
  )
  useEffect(() => {
    setSearchSettings(state.getProductListViewModelSettings())
  }, [state])

  useEffect(() => {    
    Products.getAll(repository, query, settings)
      .then((list) => {
        setProducts(list)
      })
      .catch((reason) => {
        console.log(reason)
      })
  }, [setProducts, query, repository, settings, setSearchSettings])
  return productList?.Products && settings ? (
    <ProductCatalog
      productList={productList}
      settings={settings}
      setSearchSettings={setSearchSettings}
    />
  ) : (
    <Spinner />
  )
}

function ProductCatalog({
  productList,
  settings,
  setSearchSettings,
}: {
  productList: DW.ProductListViewModel
  settings: DW.ProductListViewModelSettings
  setSearchSettings: React.Dispatch<React.SetStateAction<DW.ProductListViewModelSettings>>
}) {
  const products = productList.Products
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-2'>
          {productList.FacetGroups && (
            <Facets
              productList={productList}
              settings={settings}
              setSearchSettings={setSearchSettings}
            />
          )}
        </div>
        <div className='col-9'>
          <div className='row'>
            {products?.map((product) => (
              <ProductInfo {...product} key={`${product.Id}.${product.VariantId}`} />
            ))}
          </div>
          <div className='row align-items-center'>
            <Paging
              productList={productList}
              settings={settings}
              setSearchSettings={setSearchSettings}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Facets({
  productList,
  settings,
  setSearchSettings,
}: {
  productList: DW.ProductListViewModel
  settings: DW.ProductListViewModelSettings
  setSearchSettings: React.Dispatch<React.SetStateAction<DW.ProductListViewModelSettings>>
}) {
  const [filter, setFilter] = useState('')
  const facets = productList.FacetGroups?.map((facetGroup) => {
    return facetGroup.Facets
  }).reduce((a, b) => {
    if (b) return a?.concat(b)
    else return a
  })
  return (
    <div>
      <div>
        <input type='text' onChange={(event) => filterFacets(event)}></input>
      </div>
      {facets?.map((facet) => (
        <div key={facet.QueryParameter}>
          <label className='h4'>{facet.QueryParameter}</label>
          <div>
            {facet.Options &&
              facet.Options.map(
                (option) =>
                  option.Count &&
                  facet.QueryParameter &&
                  (filter === '' || option.Value?.toLowerCase()?.startsWith(filter)) && (
                    <FacetOption
                      facetGroup={facet.QueryParameter}
                      facetOption={option}
                      productList={productList}
                      settings={settings}
                      setSearchSettings={setSearchSettings}
                      key={option.Name}
                    />
                  )
              )}
          </div>
        </div>
      ))}
    </div>
  )
  function filterFacets(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value.toLowerCase())
  }
}

function FacetOption({
  facetGroup,
  facetOption,
  productList,
  settings,
  setSearchSettings,
}: {
  facetGroup: string
  facetOption: DW.FacetOptionViewModel
  productList: DW.ProductListViewModel
  settings: DW.ProductListViewModelSettings
  setSearchSettings: React.Dispatch<React.SetStateAction<DW.ProductListViewModelSettings>>
}) {
  return (
    <div>
      <input
        type='checkbox'
        checked={facetOption.Selected}
        onChange={() => {
          facetOption.Selected === true
            ? removeFacet(facetGroup, facetOption.Value)
            : addFacet(facetGroup, facetOption.Value)
        }}
      />
      {`${facetOption.Name} (${facetOption.Count})`}
    </div>
  )
  function removeFacet(name: string, value: any) {
    if (!settings.Parameters) settings.Parameters = {}
    if (value !== '') {
      const newValue = settings.Parameters[name].replace(`,${value}`, '').replace(value, '')
      if (newValue === '') delete settings.Parameters[name]
      else settings.Parameters[name] = newValue
    }
    productList.Products = undefined
    setSearchSettings({ ...settings, Parameters: { ...settings.Parameters } })
  }
  function addFacet(name: string, value: any) {
    if (!settings.Parameters) settings.Parameters = {}

    if (settings.Parameters[name]) settings.Parameters[name] += `,${value}`
    else settings.Parameters[name] = value

    productList.Products = undefined
    setSearchSettings({ ...settings, Parameters: { ...settings.Parameters } })
  }
}

function Paging({
  productList,
  settings,
  setSearchSettings,
}: {
  productList: DW.ProductListViewModel
  settings: DW.ProductListViewModelSettings
  setSearchSettings: React.Dispatch<React.SetStateAction<DW.ProductListViewModelSettings>>
}) {
  const pageCount = productList?.PageCount ?? 1
  const currentPage = settings.CurrentPage ?? 1
  const previousPage = currentPage - 1
  const nextPage = currentPage + 1
  const result = (
    <div>
      <button onClick={() => setCurrentPage(1)}>&lt;&lt;</button>
      <button onClick={() => updateCurrentPage(-1)}>&lt;</button>
      {previousPage > 1 && (
        <button onClick={() => updateCurrentPage(-2)}>{previousPage - 1}</button>
      )}
      {previousPage > 0 && <button onClick={() => updateCurrentPage(-1)}>{previousPage}</button>}
      <button className='font-weight-bold'>{currentPage}</button>
      {nextPage < pageCount && <button onClick={() => updateCurrentPage(1)}>{nextPage}</button>}
      {nextPage + 1 < pageCount && (
        <button onClick={() => updateCurrentPage(2)}>{nextPage + 1}</button>
      )}
      <button onClick={() => updateCurrentPage(1)}>&gt;</button>
      <button onClick={() => setCurrentPage(pageCount)}>&gt;&gt;</button>
    </div>
  )
  return result
  function updateCurrentPage(increment: number) {
    const newPage = (settings?.CurrentPage ?? 1) + increment
    setCurrentPage(newPage)
  }
  function setCurrentPage(newPage: number) {
    if (newPage > 0 && pageCount >= newPage) {
      const newSettings = { ...settings, CurrentPage: newPage }
      setSearchSettings(newSettings)
    }
  }
}

function ProductInfo(product: DW.ProductViewModel) {
  const link = `/detail/${product.Id}/${product.VariantId}`
  return (
    <div className='row'>
      <div className='col-xs'>
        <Link to={link}>
          <GetImage src={product.DefaultImage?.Value} alt={product.Name} />
        </Link>
      </div>
      <div className='col-md'>
        <div>
          <Link to={link}>{product.Name}</Link>
        </div>
        <div>{product.Id}</div>
        <div dangerouslySetInnerHTML={{ __html: product.ShortDescription ?? '' }}></div>
        <div className='row'>
          <div className='col- offset-md-10'>{product.VariantInfo?.Price?.PriceFormatted}</div>
        </div>
      </div>
    </div>
  )
}
