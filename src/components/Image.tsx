import React from 'react'
import cx from 'classnames'
import * as DW from '../api/DWGenerated'

export const baseImgPath =
  '/Admin/Public/GetImage.ashx?width=300&height=300&crop=5&Compression=75&DoNotUpscale=true&FillCanvas=true&image='

export function GetImage({
  src,
  alt,
  className,
}: {
  src?: string | null
  alt?: string | null
  className?: string | null
}) {
  return (
    <img
      src={baseImgPath + src}
      alt={alt?.substring(0, 100) ?? ''}
      className={cx({ className }, 'border')}
    ></img>
  )
}

export function Gallery({ images }: { images?: DW.MediaViewModel[] | null }) {
  const id = 'DetailImages'
  let activeToggle = false
  return (
    <div id={id} className='carousel slide carousel-fade' data-interval='false'>
      <div className='carousel-inner'>
        {images?.map((image) => (
          <Slide
            {...{
              src: image.Value,
              alt: image.Name,
              active: activeToggle ? undefined : (activeToggle = true),
            }}
            key={image.Value}
          />
        ))}
      </div>
      <a className='carousel-control-prev' href={`#${id}`} role='button' data-slide='prev'>
        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
        <span className='sr-only'>Previous</span>
      </a>
      <a className='carousel-control-next' href={`#${id}`} role='button' data-slide='next'>
        <span className='carousel-control-next-icon' aria-hidden='true'></span>
        <span className='sr-only'>Next</span>
      </a>
    </div>
  )
}

function Slide({
  src,
  alt,
  active,
}: {
  src?: string | null
  alt?: string | null
  active?: boolean
}) {
  return (
    <div className={cx('carousel-item', { active })}>
      <GetImage {...{ src, alt, className: 'd-block w-100' }} />
    </div>
  )
}
