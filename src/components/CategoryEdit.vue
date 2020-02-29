<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>

      <form @submit.prevent="sumbitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id">{{
              c.title
            }}</option>
          </select>
          <label>Выберите категорию</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: requiredField }"
          />
          <label for="name">Название</label>
          <span v-if="requiredField" class="helper-text invalid"
            >Введите название</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: minValueField }"
          />
          <label for="limit">Лимит</label>
          <span v-if="minValueField" class="helper-text invalid"
            >Минимальная величина {{ $v.limit.$params.minValue.min }}</span
          >
        </div>
        <button class="btn waves-effect waves-light" type="submit">
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";

export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: "",
    limit: 100,
    current: null
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(100) }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.select = M.FormSelect.init(this.$refs.select);
    // eslint-disable-next-line no-undef
    M.updateTextFields();
  },
  methods: {
    async sumbitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        };
        await this.$store.dispatch("updateCategory", categoryData);
        this.$message("Категория успешно обновлена");
        this.$emit("updated", categoryData);

        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.current = id;
    this.title = title;
    this.limit = limit;
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy;
    }
  },
  watch: {
    current(catId) {
      const { title, limit } = this.categories.find(c => c.id === catId);
      this.title = title;
      this.limit = limit;
      console.log(catId);
    }
  },
  computed: {
    requiredField() {
      return this.$v.title.$dirty && !this.$v.title.required;
    },
    minValueField() {
      return this.$v.limit.$dirty && !this.$v.limit.minValue;
    }
  }
};
</script>
