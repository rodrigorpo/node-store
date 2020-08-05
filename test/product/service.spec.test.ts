import { IProductService } from '../../src/product/service/product.service.interface'
import { ProductService } from '../../src/product/service/product.service'
import { Product } from '../../src/product/dto/product'

import { mock, mockDeep, anyString, mockReset } from 'jest-mock-extended'
import { IPaginateRepository } from '../../src/common/repository.interface'
import { wrapper } from './mock.utils'

import { NotFound } from '../../src/common/exceptions/error.handler'

import { v4 } from 'uuid'
import { SimpleId } from '../../src/common/simpleId.common'

const repository = mockDeep<IPaginateRepository<Product>>()
const service: IProductService = new ProductService(repository)

describe('Products Service', () => {
    describe('Get all products', () => {
        beforeEach(() => {
            mockReset(repository)
        })

        it('When find any products, then return', async () => {
            const expectedProd: Product[] = Array.of(
                generateProduct('Item 1'),
                generateProduct('Item 2'),
                generateProduct('Item 3')
            )

            repository.getAll.calledWith(0).mockReturnValue(wrapper<Product[]>(expectedProd))

            const actual = await service.getAllPaginated(0)
            expect(actual).toBe(expectedProd)
        })

        it('When there are no products, then return empty list', async () => {
            const empty: Product[] = []

            repository.getAll.calledWith(0).mockReturnValue(wrapper<Product[]>(empty))

            const actual = await service.getAllPaginated(0)
            expect(actual).toBe(empty)
        })
    })
})

const generateProduct = (name: string) => {
    return new Product({
        name: name,
        description: '',
        price: 20.5,
        category: 'Some category',
        remainingUnits: 10,
        created: new Date(),
    })
}
