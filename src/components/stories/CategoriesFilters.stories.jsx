import CategoriesFilters from "../CategoriesFilters";

export default {
  title: "Components/CategoriesFilters",
  component: CategoriesFilters,
};

const Template = (args) => <CategoriesFilters {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  categories: new Array(4)
    .fill(0)
    .map((_, id) => ({ label: `category ${id}`, slug: `cat${id}`, id })),
};
