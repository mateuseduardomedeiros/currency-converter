<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    chartLabel: { type: Array },
    label: { type: String },
    chartData: { type: Array },
    options: { type: Object },
    color: { type: String },
  },
  watch: {
    async chartData() {
      this.render();
    },
  },
  methods: {
    render() {
      this.renderChart(
        {
          labels: this.chartLabel,
          datasets: [
            {
              fill: false,
              borderColor: this.color,
              label: this.label,
              data: this.chartData,
              backgroundColor: this.color,
            },
          ],
        },
        this.options
      );
    },
  },
  mounted() {
    this.render();
  },
};
</script>
