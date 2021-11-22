import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'Simple',
  props: {
    title: {
      type: String,
      defalut: 'title',
    },
  },
  setup(props) {
    console.log(props);
    return {
      ...props,
    };
  },
  render() {
    const { title } = this;
    return <div>Package Simple, {title}</div>;
  },
});
