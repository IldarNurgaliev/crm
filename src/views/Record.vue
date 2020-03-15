<template>
  <div>
    <div class="page-title">
      <h3>{{ "Menu_NewRecord" | localize }}</h3>
    </div>

    <Loader v-if="loading" />
    <p class="center" v-else-if="!categories.length">
      {{ "Category_CategoriesIsNot" | localize
      }}<router-link to="/categories">{{
        "add_new_category" | localize
      }}</router-link>
    </p>
    <form class="form" v-else @submit.prevent="handlerSubmit">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{
            c.title
          }}</option>
        </select>
        <label>{{ "select_category" | localize }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ "Income" | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ "Outcome" | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: amountField }"
        />
        <label for="amount">{{ "Detail_Amount" | localize }}</label>

        <span v-if="amountField" class="helper-text invalid"
          >{{ "minValue" | localize }}
          {{ $v.amount.$params.minValue.min }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{ invalid: descriptionField }"
        />
        <label for="description">{{ "Detail_Description" | localize }}</label>
        <span v-if="descriptionField" class="helper-text invalid">{{
          "enter_description" | localize
        }}</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ "create" | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  metaInfo() {
    return {
      title: this.$title("Menu_NewRecord")
    };
  },
  name: "record",
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null,
    type: "outcome",
    amount: 1,
    description: ""
  }),
  validations: {
    amount: { minValue: minValue(1) },
    description: { required }
  },
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories.length) {
      this.category = this.categories[0].id;
    }
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select);
      // eslint-disable-next-line no-undef
      M.updateTextFields();
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy;
    }
  },
  computed: {
    ...mapGetters(["info"]),
    amountField() {
      return this.$v.amount.$dirty && !this.$v.amount.minValue;
    },
    descriptionField() {
      return this.$v.description.$dirty && !this.$v.description.required;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.amount;
    }
  },
  methods: {
    async handlerSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch("createRecord", {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          });
          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;

          await this.$store.dispatch("updateInfo", { bill });
          this.$message("Запись успешно создана");
          this.$v.reset();
          this.amount = 1;
          this.description = "";
          // eslint-disable-next-line no-empty
        } catch (error) {}
      } else {
        this.$message(
          `Недостаточно средств на счете (${this.amount - this.info.bill})`
        );
      }
    }
  }
};
</script>
