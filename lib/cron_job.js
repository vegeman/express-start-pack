// const mongo = require('./mongo.js')
// const logger = require('./logger.js')
// const slack = require('./slack.js')
// const orderHistory = require('../api/order_history.js')
// const { syncPrice } = require('../api/drink.js')
// const _ = require('lodash')
// const nodemailer = require('nodemailer')
// const moment = require('moment')
// const CronJob = require('cron').CronJob
// const gmailConfig = require('./config.js').gmail
// const transporter = nodemailer.createTransport(gmailConfig, { from: 'CloudBar Service <cloudbar@botrista.io>' })
// const subscribe = [
//   'justkitchen',
//   'chicken_li',
//   'fleur',
//   'kaidonno'
// ]
// const exclude = [
//   'ncku',
//   'la kaffa'
// ]

// const cron_job = {
//   async inventoryHistory() {
//     logger.info('Updating inventory history...')
//     const userData = JSON.parse(JSON.stringify(await mongo.get_user()))
//     const userDataLength = userData.length
//     for (let i = 0; i < userDataLength; i++) {
//       if (!userData[i].machines) continue
//       for (let j = 0; j < userData[i].machines.length; j++) {
//         userData[i].machines[j].inventory.forEach((v, index) => {
//           userData[i].machines[j].inventory[index].used_machine = userData[i].machines[j].serial_num
//         })
//       }
//       const machineInventory = _.flatten(userData[i].machines.map(e => e.inventory))
//       const inventoryList = []
//       for (let j = 0; j < machineInventory.length; j++) {
//         const inventoryIndex = inventoryList.findIndex(e => e.used_machine === machineInventory[j].used_machine && e.sku === machineInventory[j].sku)
//         if (inventoryIndex === -1) {
//           inventoryList.push({
//             user_name: userData[i].user_name,
//             used_machine: machineInventory[j].used_machine,
//             sku: machineInventory[j].sku,
//             volume: machineInventory[j].excess ? -machineInventory[j].volume_liter : machineInventory[j].volume_liter,
//             timestamp: moment.utc().startOf('days').toISOString(),
//             amount: machineInventory[j].excess ? -1 : 1
//           })
//         } else {
//           if (machineInventory[j].excess) {
//             inventoryList[inventoryIndex].volume -= machineInventory[j].volume_liter
//             inventoryList[inventoryIndex].amount--
//           } else {
//             inventoryList[inventoryIndex].volume += machineInventory[j].volume_liter
//             inventoryList[inventoryIndex].amount++
//           }
//         }
//       }
//       // console.log(inventoryList)

//       for (let j = 0; j < inventoryList.length; j++) {
//         mongo.post_inventory_history(inventoryList[j])
//       }
//     }
//     syncPrice()
//   },
//   async alert() {
//     logger.info('Checking order history...')
//     let userData = JSON.parse(JSON.stringify(await mongo.get_user_by_type('Headquarter')))
//     // let userData = JSON.parse(JSON.stringify(await mongo.get_user_by_type('Botrista')))
//     userData = userData.filter(e => e.status === 'active')
//     const userDataLength = userData.length
//     for (let i = 0; i < userDataLength; i++) {
//       if (exclude.includes(userData[i].user_name)) continue
//       const orderCheck = await mongo.get_order_history({ user_name: userData[i].user_name })
//       let warning = ''
//       if (orderCheck[0] && moment().diff(orderCheck[0].timestamp, 'days') > 2) {
//         warning += `This user ${userData[i].user_name} has no sales record for ${moment().diff(orderCheck[0].timestamp, 'days')} days.\n`
//       }

//       // offline warning
//       for (let j = 0; j < userData[i].machines.length; j++) {
//         if (moment().diff(userData[i].machines[j].last_used, 'days') > 2) {
//           warning += `The machine ${userData[i].machines[j].serial_num}(${userData[i].user_name} - ${userData[i].machines[j].name}) is offline for ${moment().diff(userData[i].machines[j].last_used, 'days')} days.\n`
//           // slack.postMessage(`The machine ${userData[i].machines[j].serial_num}(${userData[i].user_name} - ${userData[i].machines[j].name}) is offline for ${moment().diff(userData[i].machines[j].last_used, 'days')} days.`)
//         }
//         if (!userData[i].machines[j].special_cleaning_date) { userData[i].machines[j].special_cleaning_date = new Date() }
//         if (!userData[i].machines[j].weekly_cleaning_date) { userData[i].machines[j].weekly_cleaning_date = new Date() }
//         if (moment().diff(userData[i].machines[j].special_cleaning_date, 'hours') > 36) {
//           warning += `The machine ${userData[i].machines[j].serial_num}(${userData[i].user_name} - ${userData[i].machines[j].name}) did not do special cleaning for ${moment().diff(userData[i].machines[j].special_cleaning_date, 'days')} days.\n`
//         }
//         if (moment().diff(userData[i].machines[j].weekly_cleaning_date, 'days') > 8) {
//           warning += `The machine ${userData[i].machines[j].serial_num}(${userData[i].user_name} - ${userData[i].machines[j].name}) did not do weekly cleaning for ${moment().diff(userData[i].machines[j].weekly_cleaning_date, 'days')} days.\n`
//         }
//       }
//       logger.info(warning)
//       if (warning) {
//         slack.postMessage(`:warning: ${warning}`)
//         warning += `Please check if there has any potential issue.`
//         transporter.sendMail({
//           to: ['paul@botrista.io', 'aaron@botrista.io', 'peter@botrista.io'],
//           // to: ['vege@botrista.io'],
//           subject: `Machine alert(${userData[i].user_name})`,
//           text: warning
//         })
//       }
//     }
//   },
//   async nodeMail() {
//     const request = []
//     const month = (moment().month() + 1) * 1
//     const userData = (await mongo.get_user_by_type('Headquarter'))

//     for (let i = 0; i < userData.length; i++) {
//       if (!subscribe.includes(userData[i].user_name)) continue
//       // if (userData[i].user_name !== 'test') continue
//       const req = {
//         query: {
//           csv: true
//           // action: 'order'
//         },
//         params: {
//           user_name: userData[i].user_name
//         },
//         body: {
//           decoded: {
//             utc: userData[i].country === 'Taiwan' ? 8 : -7
//           }
//         }
//       }

//       const csvData = await orderHistory.dailyReport(req)

//       const mailOptions = {
//         to: ['vege@botrista.io', 'aaron@botrista.io', 'peter@botrista.io'],
//         // to: ['vege@botrista.io', 'paul@botrista.io'],
//         subject: `${req.params.user_name} ${moment().month(month - 1).format('MMMM')} Sales Report`,
//         text: 'FYI',
//         attachments: [{
//           filename: `${req.params.user_name} ${moment().month(month - 1).format('MMMM')} Sales Report.csv`,
//           content: csvData.join('\n')
//         }]
//       }

//       request.push(transporter.sendMail(mailOptions))
//     }

//     await Promise.all(request).then((val) => console.log(val))
//   },
//   async monthlySales() {
//     const request = []
//     let userData = (await mongo.get_user_by_type('Headquarter'))
//     userData = userData.filter(e => e.country === 'United States')
//     for (let i = 0; i < userData.length; i++) {
//       const req = {
//         query: {
//           csv: true
//           // action: 'order'
//         },
//         params: {
//           user_name: userData[i].user_name
//         },
//         body: {
//           decoded: {
//             utc: userData[i].country === 'Taiwan' ? 8 : -7
//           }
//         }
//       }

//       const csvData = await orderHistory.monthlyReport(req)
//       // console.log(csvData)
//       const mailOptions = {
//         to: ['vege@botrista.io', 'grace@botrista.io'],
//         subject: `${req.params.user_name} 2020 Sales Report`,
//         text: 'FYI',
//         attachments: [{
//           filename: `${req.params.user_name} 2020 Sales Report.csv`,
//           content: csvData.join('\n')
//         }]
//       }

//       request.push(transporter.sendMail(mailOptions))
//     }
//   }
// }

// if (process.env.NODE_APP_INSTANCE === '0') {
//   console.log(`You are in ${process.env.APP_ENV} environment!`)
//   if (process.env.APP_ENV === 'production') {
//     const job = new CronJob(
//       '59 59 23 * * *',
//       () => cron_job.inventoryHistory(),
//       null,
//       true,
//       'Europe/London'
//     )
//     const job2 = new CronJob(
//       '59 59 23 * * *',
//       () => cron_job.alert(),
//       null,
//       true,
//       'Europe/London'
//     )
//     const job3 = new CronJob(
//       '00 50 23 * * *',
//       () => cron_job.nodeMail(),
//       null,
//       true,
//       'Europe/London'
//     )
//     cron_job.inventoryHistory()
//     // cron_job.nodeMail()
//     // cron_job.monthlySales()
//   }
// } else {
//   cron_job.inventoryHistory()
//   // cron_job.nodeMail()
// }
// // cron_job.alert()

// module.exports = cron_job

console.log('here')
