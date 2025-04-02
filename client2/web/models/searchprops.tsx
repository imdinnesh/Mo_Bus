import {z} from 'zod'

export const SeachProps=z.object({
    query:z.string().nonempty()

})
