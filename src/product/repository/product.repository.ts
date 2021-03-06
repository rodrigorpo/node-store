import { IPaginateRepository } from '../../common/repository.interface'
import { Product } from '../dto/product'
import { productSchema } from '../schema/product.entity'

export class ProductRepository implements IPaginateRepository<Product> {
    private limitPerPage: number = Number(process.env.NUMBER_PER_PAGE) || 10

    async getAll(page: number): Promise<Product[]> {
        const modelList = await productSchema
            .find({})
            .skip(page * this.limitPerPage)
            .limit(this.limitPerPage)

        const products: Product[] = modelList
        .map((it) => it.toObject())
        .map(this.adaptToProduct)

        return products
    }

    async getById(id: string): Promise<Product> {
        const product = await productSchema.findOne({ _id: id })

        if (!product) {
            return null
        }

        const resp = product.toObject()
        return this.adaptToProduct(resp)
    }

    async create(product: Product): Promise<Product> {
        const created = await productSchema.create({ ...product, _id: product.id })
        const resp = created.toObject()
        return { ...resp, id: resp._id.toString() }
    }

    async update(id: string, product: Product): Promise<boolean> {
        const updated = await productSchema.updateOne({ _id: id }, { ...product, _id: id })

        return updated.n > 0
    }

    async delete(id: string): Promise<void> {
        await productSchema.deleteOne({ _id: id })
    }

    adaptToProduct(response: any): Product {
        const id: string = response._id
        delete response._id
        return new Product({ ...response, id }, id)
    }
}
