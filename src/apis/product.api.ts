import { Product, ProductList, ProductListConfig } from './../types/product.type'
import { http } from 'src/utils/http'
import { SuccessResponse } from 'src/types/utils.type'
import { Purchase } from 'src/types/purchase.type'

const URL = 'products'

export const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, { params })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  },
  buyProduct(body: { productId: string; buy_count: number }[]) {
    return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body)
  },
  updatePurchase(body: { productId: string; buy_count: number }) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchaseIds: string) {
    return http.delete<SuccessResponse<{ delete_cound: number }>>(`${URL}/purchase`, {
      data: purchaseIds
    })
  }
}
