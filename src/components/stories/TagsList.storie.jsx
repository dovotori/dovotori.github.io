import TagsList from '../TagsList';

export default {
  title: 'Components/TagsList',
  component: TagsList,
};

const Template = (args) => <TagsList {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  tags: new Array(4).fill(0).map((v, id) => ({
    label: `tag ${id}`,
    slug: `tag${id}`,
    categoryId: id % 3 === 0 ? 1 : 0,
  })),
};
