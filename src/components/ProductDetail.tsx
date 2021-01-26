import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { EcommerceContext } from '../api/Context'
import * as DW from '../api/DWGenerated'
import * as Products from '../api/Products'
import { NoProductsFound, Spinner } from './Common'
import { Gallery } from './Image'

export function ProductDetail() {
  const [prod, setProduct] = useState<DW.ProductViewModel>()
  const { productId, variantId } = useParams<{ productId: string; variantId?: string }>()
  const state = useContext(EcommerceContext)
  useEffect(() => {
    if (state) {
      const settings = state.getProductViewModelSettings()
      Products.getProduct(productId, variantId ?? '', settings).then((p) => {
        setProduct(p)
      })
    }
  }, [setProduct, productId, variantId, state])
  const result =
    prod === undefined ? (
      <Spinner />
    ) : prod === null ? (
      <NoProductsFound />
    ) : (
      <Product state={state} model={prod} />
    )
  return result
}

function Product({
  state,
  model: product,
}: {
  state?: Ecommerce.AppContext
  model: DW.ProductViewModel
}) {
  const detailImages =
    product.AssetCategories?.find((assetCategory) => assetCategory.Name === 'Images')?.Assets ?? []
  const imagePatternImages = product.ImagePatternImages ?? []
  const temp = [...detailImages, ...imagePatternImages]
  const images = new Map<string, DW.MediaViewModel>()
  temp.forEach((image) => {
    if (!image.Value || images.has(image.Value)) {
      return
    }
    images.set(image.Value, image)
  })
  return (
    <div className='container'>
      <div className='row'>
        <div>
          <Link to='/'>Back</Link>
        </div>
        <div className='col-4'>
          <Gallery images={Array.from(images.values())} />
        </div>
        <div className='col-8'>
          <div>{product.Id}</div>
          <div>{product.Name}</div>
          <div dangerouslySetInnerHTML={{ __html: product.LongDescription ?? '' }}></div>
          <div>{product.Price?.PriceFormatted}</div>
        </div>
      </div>
    </div>
  )
}
