import type { PageServerLoad } from './$types';
import { z } from 'zod'
import { message, superValidate } from 'sveltekit-superforms/server'
import { error, fail, redirect } from '@sveltejs/kit';

const userSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(2),
    email: z.string().email()
})

const crudSchema = userSchema.extend({
    id: userSchema.shape.id.optional()
})

const userDB : z.infer<typeof userSchema>[] = [
    {
        id: '911',
        name: 'cop',
        email: 'fineswine69@bacon.com'
    },
    {
        id: '666',
        name: 'morningstar',
        email: 'belowasabove@hades.net'
    }
];

export const load = (async ({ params }) => {
    const user = userDB.find(u => u.id == params.id)

    if(params.id && !user) throw error(404)

    const form = await superValidate(user, crudSchema)
    return { form, userDB };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({request}) => {
        await new Promise((r) => setTimeout(r, 2000));

        const formData = await request.formData();
        const form = await superValidate(request, crudSchema);
        console.log(form);

        if(!form.valid) return fail(400, { form });

        if(form.data.id){
            const index = userDB.findIndex(u => u.id == form.data.id);
            if(index == -1) throw error(404);

            if(formData.has('delete')){
                //Delete user
                userDB.splice(index, 1);
                throw redirect(303, '/users');
            }else{
                //Update user
                userDB[index] = {...form.data, id: form.data.id}
                return message(form, 'User updated!');
            }
        }else{
            //create user
            const id = Math.random().toString().slice(2)
            const user = {...form.data, id}
            userDB.push(user)
        }
        return message(form, 'User created!')
    }
};