<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="6" lg="5">
      <v-card>
        <v-card-text>
          <!-- <v-card-text class="d-flex flex-row justify-center"> -->
          <div class="justify-center text-center">
            <v-text-field-money
              dense
              class="centered-input"
              v-model="qtd"
              type="number"
              label="Quantidade"
              v-bind:properties="{
                prefix: `${prefix}`,
              }"
            ></v-text-field-money>
            <v-select
              class="selects"
              outlined
              v-model="from"
              :items="moedas"
              item-text="description"
              item-value="code"
            >
              <template v-slot:item="{ item }">
                <flag
                  v-if="item.flag"
                  :country="item.flag"
                  size="big"
                  class="mr-1"
                />
                <v-icon v-else class="mr-1" size="52">mdi-help</v-icon>
                <span>{{ item.code }}</span>
                <span> - </span>
                <span>{{ item.description }}</span>
              </template>
              <template v-slot:selection="{ item }">
                <flag
                  v-if="item.flag"
                  :country="item.flag"
                  size="big"
                  class="mr-1"
                />

                <span>{{ item.code }}/{{ item.description }}</span>
              </template>
            </v-select>
            <v-btn @click.stop="swap()" icon color="#0D47A1">
              <v-icon medium>mdi-swap-vertical-bold</v-icon>
            </v-btn>

            <v-select
              class="selects mt-5"
              outlined
              v-model="to"
              :items="moedas"
              item-text="description"
              item-value="code"
            >
              <template v-slot:item="{ item }">
                <flag
                  v-if="item.flag"
                  :country="item.flag"
                  size="big"
                  class="mr-1"
                />
                <v-icon v-else class="mr-1" size="52">mdi-help</v-icon>
                <span>{{ item.code }}</span>
                <span> - </span>
                <span>{{ item.description }}</span>
              </template>
              <template v-slot:selection="{ item }">
                <flag
                  v-if="item.flag"
                  :country="item.flag"
                  size="big"
                  class="mr-1"
                />
                <span>{{ item.code }}/{{ item.description }}</span>
              </template>
            </v-select>
          </div>
        </v-card-text>
        <v-card-title class="justify-center">
          {{ prefixFinal }} {{ final ? final.replace(".", ",") : final || 0 }}
        </v-card-title>
        <!-- <v-card-subtitle class="text-center"> alt </v-card-subtitle> -->
        <v-card class="mt-3 pa-3" elevation="0">
          <LineChart
            v-if="lineData != null"
            :chartData="lineData"
            :chartLabel="lineLabels"
            :label="`${from}/${to}`"
            :options="lineOptions"
            :height="230"
            color="#0D47A1"
          />
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { format, subDays } from "date-fns";
import LineChart from "./LineChart.vue";
import { parseISO } from "date-fns/esm/fp";
export default {
  name: "Card",
  components: {
    LineChart,
  },
  watch: {
    from: function (val) {
      let aux = this.moedas.find((el) => el.code == val);
      this.prefix = aux.prefix;
      this.convert();
      this.lastSevenDays();
    },
    to: function (val) {
      let aux = this.moedas.find((el) => el.code == val);
      this.prefixFinal = aux.prefix;
      this.convert();
      this.lastSevenDays();
    },
    qtd: function () {
      this.convert();
    },
  },
  data() {
    return {
      format,
      subDays,
      qtd: 1,
      prefix: "U$",
      prefixFinal: "R$",
      from: "USD",
      to: "BRL",
      final: null,
      lineLabels: null,
      lineData: null,
      lineOptions: {
        responsive: true,
        tooltips: {
          intersect: false,
          mode: "nearest",
        },
      },
      moedas: [
        {
          code: "BRL",
          description: "Real Brasileiro",
          flag: "bra",
          prefix: "R$",
        },
        {
          code: "USD",
          description: "Dólar Americano",
          flag: "usa",
          prefix: "U$",
        },
        {
          code: "AUD",
          description: "Dólar Australiano",
          flag: "au",
          prefix: "A$",
        },
        {
          code: "CAD",
          description: "Dólar Canadense",
          flag: "ca",
          prefix: "C$",
        },
        { code: "EUR", description: "Euro", flag: "eu", prefix: "€" },
        { code: "JPY", description: "Iene Japonês", flag: "jp", prefix: "¥" },
        {
          code: "GBP",
          description: "Libra Esterlina",
          flag: "gb",
          prefix: "£",
        },
        { code: "CHF", description: "Franco Suíço", flag: "ch", prefix: "Fr" },
        { code: "CNY", description: "Yuan Chinês", flag: "cn", prefix: "	¥" },
        { code: "ARS", description: "Peso Argentino", flag: "ar", prefix: "$" },
        {
          code: "TRY",
          description: "Nova Lira Turca",
          flag: "tr",
          prefix: "₺",
        },
      ],
    };
  },
  async created() {
    await this.convert();
    await this.lastSevenDays();
  },
  async mounted() {},
  methods: {
    swap() {
      let aux = this.to;
      this.to = this.from;
      this.from = aux;
    },
    async lastSevenDays() {
      let auxData = [];
      let auxLabels = [];
      await this.$axios
        .get(
          `https://api.exchangerate.host/timeseries?base=${this.from}&symbols=${
            this.to
          }&start_date=${format(
            subDays(new Date(), 7),
            "yyyy-MM-dd"
          )}&end_date=${format(new Date(), "yyyy-MM-dd")}`
        )
        .then((response) => {
          Object.values(response.data.rates).forEach((el) => {
            auxData.push(Object.values(el)[0]);
          });
          Object.entries(response.data.rates).forEach((el) => {
            auxLabels.push(format(parseISO(el[0]), "dd/MM/yyyy"));
          });
          this.lineData = auxData;
          this.lineLabels = auxLabels;
        });
    },
    async convert() {
      await this.$axios
        .get(
          `https://api.exchangerate.host/convert?from=${this.from}&to=${this.to}&amount=${this.qtd}`
        )
        .then((response) => {
          if (response.data.result == null) {
            this.final = response.data.result;
          } else {
            this.final = response.data.result.toFixed(2);
          }
        });
    },
  },
};
</script>

<style>
/* .v-input__slot {
  height: 40px;
  width: 335px;
} */
</style>
