<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ "create" | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: requiredField }"
          />
          <label for="name">{{ "label" | localize }}</label>
          <span v-if="requiredField" class="helper-text invalid">{{
            "Enter_label" | localize
          }}</span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: minValueField }"
          />
          <label for="limit">{{ "limit" | localize }}</label>
          <span v-if="minValueField" class="helper-text invalid"
            >{{ "minValue" | localize }}
            {{ $v.limit.$params.minValue.min }}</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ "create" | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
export default {
  data: () => ({
    title: "",
    limit: 100
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(100) }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    M.updateTextFields();
  },
  methods: {
    async submitHandler() {
      console.log(this.$v.limit);
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        // eslint-disable-next-line no-unused-vars
        const category = await this.$store.dispatch("createCategory", {
          title: this.title,
          limit: this.limit
        });
        this.title = "";
        this.limit = 100;
        this.$v.$reset();
        this.$message("Категория была создана");
        this.$emit("created", category);
        // eslint-disable-next-line no-empty
      } catch (error) {}
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
