import ProjectHeader from "../ProjectHeader";

export default {
  title: "Components/ProjectHeader",
  component: ProjectHeader,
};

const Template = (args) => <ProjectHeader {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  title: "Title",
  inverseTitle: "Invert title",
  descriptions: ["Hello c'est un project.", "Avec plusieurs descriptions  "],
  date: 2000,
};
