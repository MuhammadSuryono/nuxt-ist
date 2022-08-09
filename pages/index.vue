<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-card border-variant="warning"
            class="mb-2"
            header="Form Input"
            header-bg-variant="warning"
            header-text-variant="white">
      <b-row>
        <b-col lg="12" sm="12" md="12">
          <form @submit.prevent="submitData">
            <b-row>
              <b-col lg="4" sm="12" md="4">
                <b-form-input type="text" v-model="form.username" placeholder="Enter Your Username" required></b-form-input>
              </b-col>
              <b-col lg="4" sm="12" md="4">
                <b-form-input type="email" v-model="form.email"  placeholder="mail@email.com" required></b-form-input>
              </b-col>
              <b-col lg="4" sm="12" md="4">
                <b-form-input type="password" v-model="form.password" min="6"  placeholder="***" required></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="12" sm="12" md="12" class="mt-3">
                <b-button variant="success" type="submit" class="float-right">
                  <b-spinner small v-if="isBusy"></b-spinner>
                  {{isBusy ? 'Loading...':'Submit'}}
                </b-button>
              </b-col>
            </b-row>
          </form>
        </b-col>
      </b-row>
    </b-card>
    <b-card border-variant="primary"
            header="Filtering Data"
            header-bg-variant="primary"
            header-text-variant="white">
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
            label="Sort"
            label-for="sort-by-select"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
            v-slot="{ ariaDescribedby }"
          >
            <b-input-group size="sm">
              <b-form-select
                id="sort-by-select"
                v-model="sortBy"
                :options="sortOptions"
                :aria-describedby="ariaDescribedby"
                class="w-75"
              >
                <template #first>
                  <option value="">-- none --</option>
                </template>
              </b-form-select>

              <b-form-select
                v-model="sortDesc"
                :disabled="!sortBy"
                :aria-describedby="ariaDescribedby"
                size="sm"
                class="w-25"
              >
                <option :value="false">Asc</option>
                <option :value="true">Desc</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            label="Initial sort"
            label-for="initial-sort-select"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              id="initial-sort-select"
              v-model="sortDirection"
              :options="['asc', 'desc', 'last']"
              size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            label="Filter"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            v-model="sortDirection"
            label="Filter On"
            description="Leave all unchecked to filter on all data"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-checkbox-group
              v-model="filterOn"
              :aria-describedby="ariaDescribedby"
              class="mt-1"
            >
              <b-form-checkbox :value="field.key" v-for="(field, iField) in fields" :key="iField">{{field.label}}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>

        <b-col sm="5" md="6" class="my-1">
          <b-form-group
            label="Per page"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-card>

    <!-- Main table element -->
    <b-card  class="mt-2" border-variant="success"
             header="Data User">
      <RemoteTable
        :current-page="currentPage"
        :fields="fields"
        :filter="filter"
        :filter-on="filterOn"
        :per-page="perPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :sort-direction="sortDirection"
        :refresh="refreshData"
        @emitTotalRows="onEmitTotalRows"
      />
    </b-card>

  </b-container>
</template>

<script>
export default {
  name: "indexPage",
  data() {
    return {
      items: [],
      fields: [
        { key: 'username', label: 'Username', sortable: true, sortDirection: 'desc' },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'roles', label: 'Roles', sortable: true, class: 'text-center' },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 2,
      pageOptions: [2, 5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      form: {
        username: "",
        password: "",
        email: ""
      },
      isBusy: false,
      refreshData: false
    }
  },
  computed: {
    sortOptions() {
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  async mounted() {
    this.totalRows = this.items.length
  },
  methods: {
    onEmitTotalRows(total) {
      this.totalRows = total
    },
    async submitData() {
      this.isBusy = true
      try {
        let resp = await this.$api.post('auth/signup', this.form)
        this.isBusy = false
        this.refreshData = true
        let data = resp.data
        this.resetForm()
      } catch (e) {
        this.isBusy = false
        alert("Failed create data, please check username or email must not exist")
      }
    },
    resetForm() {
      this.form = {
        username: "",
        password: "",
        email: ""
      }
    }
  }
}
</script>
