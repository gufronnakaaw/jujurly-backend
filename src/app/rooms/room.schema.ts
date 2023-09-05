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

export const getRoomsByCodeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        start: { type: 'number' },
        end: { type: 'number' },
        code: { type: 'string' },
        total_votes: { type: 'number' },
        is_available: { type: 'boolean' },
        candidates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              percentage: { type: 'number' },
              vote_count: { type: 'number' },
            },
          },
        },
      },
    },
  },
};

export const getRoomsByIdSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        start: { type: 'number' },
        end: { type: 'number' },
        code: { type: 'string' },
        candidates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const updateRoomsSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        start: { type: 'number' },
        end: { type: 'number' },
        code: { type: 'string' },
        candidates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
