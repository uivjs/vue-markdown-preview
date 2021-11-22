@vue-simple-package/simple
===

```bash
npm i @vue-simple-package/simple
```

```vue
<template>
  <div>
    <simple title="001"></simple>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Simple from '@vue-simple-package/simple';

export default defineComponent({
  components: {
    Simple
  }
});
</script>
```