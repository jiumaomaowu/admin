<template>
  <div class="index">
      <vue-event-calendar    :events="demoEvents"    @day-changed="handleDayChanged" @month-changed="handleMonthChanged"></vue-event-calendar>

  </div>
</template>

<script>
let today = new Date();

	import { getMeetinglist} from '../../api/api';
export default {
  name: 'index',
  data () {
    return {
        month:'',
        demoEvents:  [
          {
            date:'2018/03/18',
            title:'11111111111'
          },
          {
            date:'2018/03/19',
            title:'11111111111'
          },
          {
            date:'2018/03/19',
            title:'11111111111'
          },
          {
            date:'2018/03/20',
            title:'11111111111'
          },
          {
            date:'2018/03/20',
            title:'11111111111'
          },
          {
            date:'2018/03/21',
            title:'11111111111'
          },

        ]
    }
  },
  methods: {
    handleDayChanged (day) {
      console.log(day)
    },
    handleMonthChanged (month) {
      let para = {
              meetmonth: month
            };

            this.listLoading = true;
            getMeetinglist(para).then((res) => {
                this.demoEvents = res.data;
            });

    },
    getMeeting(month){
      let para = {
        meetmonth: month
      };

      this.listLoading = true;
      getMeetinglist(para).then((res) => {
          this.demoEvents = res.data;
      });
    }
  },
  mounted() {

      this.getMeeting()

    }
}
</script>
<style scoped lang="scss">
@media screen and (min-width: 768px){
  .__vev_calendar-wrapper .events-wrapper {
    width: 50%;
    background-color: #409EFF!important;
    color: #fff;
    padding: 40px 45px;
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
  }
}


</style>
