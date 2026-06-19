import { StorefrontApiClient } from '@rackvise/storefront-sdk'
import { STOREFRONT_CONFIG } from '#/env'

let _client: StorefrontApiClient | undefined

export function getStorefrontClient(): StorefrontApiClient {
  if (!_client) {
    _client = new StorefrontApiClient(STOREFRONT_CONFIG)
  }
  return _client
}
