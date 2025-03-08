import {z} from 'zod'

export const SeachProps=z.object({
    route_number:z.string().nonempty(),

})
