export const getAllSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          start: { type: 'number' },
          end: { type: 'number' },
          code: { type: 'string' },
        },
      },
    },
  },
};
