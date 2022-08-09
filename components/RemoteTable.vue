<template>
  <div>
    <b-table
      :items="myProvider"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      :busy="isBusy"
      show-empty
      small
    >

      <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "RemoteTable",
  props: ["fields", "currentPage","perPage","filter","filterOn","sortBy","sortDesc","sortDirection","refresh"],
  data() {
   return {
     isBusy: false,
     totalRows: 0
   }
  },
  async mounted() {
    console.log(this.refresh)
  },
  methods: {
    async myProvider(ctx) {
      this.isBusy = true
      let parameter = {
        "filters": [],
        "sorts": [],
        "page": ctx.currentPage - 1,
        "size": ctx.perPage
      }

      if (ctx.sortBy !== '') {
        parameter.sorts.push({
          key: ctx.sortBy,
          direction: ctx.sortDesc ? "DESC":"ASC"
        })
      }

      if ((ctx.filter !== null && ctx.filter !== '')) {
        if (this.filterOn.length === 0) alert("Please select field filter")
        else {
          this.filterOn.forEach((filtered) => {
            parameter.sorts.push({
              key: filtered,
              direction: this.sortDirection.toUpperCase()
            })

            parameter.filters.push({
              "key": filtered,
              "operator": "LIKE",
              "field_type": "STRING",
              "value": ctx.filter
            })
          })
        }
      }
      try {
        let resp = await this.$api.post('user/list', parameter)
        this.isBusy = false
        let data = resp.data.data
        this.totalRows = data.totalElements
        this.$emit('emitTotalRows',data.totalElements)
        return data.content
      } catch (e) {
        this.isBusy = false
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
