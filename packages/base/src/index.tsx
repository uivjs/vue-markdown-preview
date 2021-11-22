import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'Base',
  props: {
    title: {
      type: String,
      defalut: 'title',
    },
  },
  setup(props) {
    return {
      ...props,
    };
  },
  render() {
    const { title } = this;
    return <div>Package Base, {title}</div>;
  },
});
