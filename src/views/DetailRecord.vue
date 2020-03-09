<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div>
        <div class="breadcrumb-wrap">
          <router-link to="/history" class="breadcrumb">{{
            "History" | localize
          }}</router-link>
          <a @click.prevent class="breadcrumb">
            {{ record.type === "income" ? "Доход" : "Расход" }}
          </a>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <div class="card" :class="colorStyle">
              <div class="card-content white-text">
                <p>
                  {{ "Detail_Description" | localize }}:
                  {{ record.description }}
                </p>
                <p>
                  {{ "Detail_Amount" | localize }}:
                  {{ record.amount | currency }}
                </p>
                <p>
                  {{ "Detail_Category" | localize }}: {{ record.categoryName }}
                </p>

                <small>{{ record.date | date("datetime") }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>
      {{ "Detail_id_warning" | localize }} = ${{ $route.params.id }}
      {{ "Detail_not_found" | localize }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Detail",
  data: () => ({
    record: null,
    loading: true
  }),
  async mounted() {
    const id = this.$route.params.id;
    const record = await this.$store.dispatch("fetchRecordById", id);
    const category = await this.$store.dispatch(
      "fetchCategoryById",
      record.categoryId
    );
    this.record = {
      ...record,
      categoryName: category.title
    };
    this.loading = false;
  },
  computed: {
    colorStyle() {
      return {
        red: this.record.type === "outcome",
        green: this.record.type === "income"
      };
    }
  }
};
</script>
