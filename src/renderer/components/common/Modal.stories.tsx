// Modal.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./Modal";
import UserCard from "../user/UserCard";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
};
export default meta;

type Story = StoryObj<typeof Modal>;
const name = {
  userName: "test",
  userId: 10,
  prefix: "test",
  imgSrc: "main.jpg",
  description: "my name is test",
};
export const Default: Story = {
  render: () => (
    <Modal>
        {/* <div>test</div> */}
      <UserCard {...name} />
    </Modal>
  ),
};
