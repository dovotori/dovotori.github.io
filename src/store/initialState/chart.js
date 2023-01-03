export default {
  name: "skills",
  value: 100,
  children: [
    {
      name: "dev",
      value: 70,
      children: [
        {
          name: "php",
          value: 10,
        },
        {
          name: "js",
          value: 70,
          children: [
            {
              name: "node",
              value: 10,
            },
            {
              name: "react",
              value: 20,
            },
            {
              name: "redux",
              value: 20,
            },
            {
              name: "webgl",
              value: 10,
            },
            {
              name: "d3",
              value: 10,
            },
            {
              name: "env",
              value: 30,
              children: [
                {
                  name: "flow",
                  value: 30,
                },
                {
                  name: "jest",
                  value: 30,
                },
                {
                  name: "webpack",
                  value: 20,
                },
                {
                  name: "gitlab",
                  value: 20,
                },
              ],
            },
          ],
        },
        {
          name: "html",
          value: 10,
        },
        {
          name: "css",
          value: 10,
        },
      ],
    },
    {
      name: "design",
      value: 30,
      children: [
        {
          name: "blender",
          value: 50,
        },
        {
          name: "inkscape",
          value: 50,
        },
      ],
    },
  ],
};
