import dayjs from 'dayjs'
// Vue.filter('dateformat', function (time) {
//   return dayjs(time).format('YYYY-MM-DD')
// })

export const dateformat = function (time) {
  return dayjs(time).format('YYYY-MM-DD')
}
