import React, { ChangeEvent, useContext } from 'react'
import { Route, Switch } from 'react-router'
import './App.css'
import { config } from './config'
import 'bootstrap/dist/css/bootstrap.min.css'
import { NoProductsFound } from './components/Common'
import { ProductList } from './components/ProductList'
import { EcommerceContext, useEcomState } from './api/Context'
import { ProductDetail } from './components/ProductDetail'

export function App() {
  const appContext = useEcomState()
  if (!appContext) return null
  return (
    <EcommerceContext.Provider value={appContext}>
      <Switch>
        <Route
          exact
          path='/'
          component={() => (
            <Shell>
              <ProductList repository={config.repository} query={config.query} />
            </Shell>
          )}
        />
        <Route
          exact
          path='/detail/:productId/:variantId?'
          component={() => (
            <Shell>
              <ProductDetail />
            </Shell>
          )}
        />
        <Route component={() => <NoProductsFound />} />
      </Switch>
    </EcommerceContext.Provider>
  )
}

function Shell(props: React.PropsWithChildren<{}>) {
  const state = useContext(EcommerceContext)
  return (
    <div>
      <div>
        <ContextSelector
          onChange={(e: ChangeEvent<HTMLSelectElement>) => state.updateCurrency(e.target.value)}
          value={state.CurrencyCode ?? config.currencies[0]}
          options={config.currencies}
        />
        <ContextSelector
          onChange={(e: ChangeEvent<HTMLSelectElement>) => state.updateLanguage(e.target.value)}
          value={state.LanguageId ?? config.languages[0]}
          options={config.languages}
        />
      </div>      
      {props.children}
    </div>
  )
}
function ContextSelector({
  onChange,
  value,
  options,
}: {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  value: string
  options: string[]
}) {
  return (
    <select value={value} onChange={onChange}>
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
