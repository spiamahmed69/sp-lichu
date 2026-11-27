// SSR entry for prerendering — renders a route to HTML string.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { StoreProvider } from './lib/store'
import { AppRoutes } from './App'

export function render(path) {
  return renderToString(
    <StoreProvider>
      <StaticRouter location={path}>
        <AppRoutes />
      </StaticRouter>
    </StoreProvider>,
  )
}
