import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string'
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'string',
      }
    ),
    defineField({
        name: 'approved',
        title: 'Approved',
        type: 'boolean',
        description: 'Comments wont show on the site without approvals',
        }
    ),
    defineField({
        name: 'post',
        type: 'reference',
        to: [{type: 'post'}]
    })
  ],
})
