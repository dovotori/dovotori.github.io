export default {
  name: 'skills',
  value: 100,
  children: [
    {
      name: 'back',
      value: 30,
      children: [
        {
          name: 'node',
          value: 40,
        },
        {
          name: 'mysql',
          value: 20,
        },
        {
          name: 'postgresql',
          value: 20,
        },
        {
          name: 'trpc',
          value: 20,
        },
      ],
    },
    {
      name: 'front',
      value: 50,
      children: [
        {
          name: 'js',
          value: 80,
          children: [
            {
              name: '3d',
              value: '10',
              children: [
                {
                  name: 'webgl',
                  value: 33,
                },
                {
                  name: 'webgpu',
                  value: 33,
                },
                {
                  name: 'babylon',
                  value: 33,
                },
              ],
            },
            {
              name: 'react',
              value: 20,
            },
            {
              name: 'redux',
              value: 10,
            },
            {
              name: 'd3',
              value: 30,
            },
            {
              name: 'env',
              value: 30,
              children: [
                {
                  name: 'flow',
                  value: 14,
                },
                {
                  name: 'jest',
                  value: 15,
                },
                {
                  name: 'webpack',
                  value: 14,
                },
                {
                  name: 'gitlab',
                  value: 14,
                },
                {
                  name: 'typescript',
                  value: 14,
                },
                {
                  name: 'playwright',
                  value: 14,
                },
                {
                  name: 'vite',
                  value: 15,
                },
              ],
            },
          ],
        },
        {
          name: 'html',
          value: 10,
        },
        {
          name: 'css',
          value: 10,
        },
      ],
    },
    {
      name: 'design',
      value: 20,
      children: [
        {
          name: 'blender',
          value: 33,
        },
        {
          name: 'inkscape',
          value: 33,
        },
        {
          name: 'figma',
          value: 33,
        },
      ],
    },
  ],
};
