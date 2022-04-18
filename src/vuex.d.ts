// vuex.d.ts
import { OpenAPIObject } from 'openapi3-ts'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<OpenAPIObject>
  }
}