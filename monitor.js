const fetch = require('node-fetch')
const beep = require('beepbeep')
const { createAudio } = require('node-mp3-player')
const API_URL = 'http://api.mwgrinpool.com/'

let latestBlockHeight = 0
const networkData = []
const validShares = []
const poolGraphRate = []
let poolBlockHeight = 0
let issueCount = 0

const fetchGrinPoolData = async (blockHeight) => {
  try {
    const url = `${API_URL}pool/stats/${blockHeight},6/gps,height,shares_processed`
    // console.log('fetchGrinPoolData url is: ', url)
    const grinPoolDataResponse = await fetch(url)
    // console.log('grinPoolDataResponse is: ', grinPoolDataResponse)
    if (!grinPoolDataResponse.status === 200) throw new Error()
    const grinPoolData = await grinPoolDataResponse.json()
    // console.log('grinPoolData is: ', grinPoolData)
    let zeroShares = 0
    grinPoolData.forEach((block) => {
      if (block.height > poolBlockHeight) {
        poolBlockHeight = block.height
      }
      if (block.shares_processed === 0) {
        zeroShares++
        console.log('a zero share block!')
      }
    })
    console.log('zero share blocks of last 6: ', zeroShares)
    if (zeroShares >= 5) {
      playMusic()
    }
    console.log('max pool height is: ', poolBlockHeight)
  } catch (e) {
    console.log('error: ', e)    
    throw new Error()
  }
}

const getLatestBlock = async () => {
  try {
    const latestBlockUrl = `${API_URL}grin/block`
    // console.log('about to fetch latest block, latestBlockUrl is: ', latestBlockUrl)
    const latestBlockResponse = await fetch(latestBlockUrl)
    // console.log('latestBlockResponse is: ', latestBlockResponse)
    if (!latestBlockResponse.ok) return
    let latestBlockData = await latestBlockResponse.json()
    // console.log('latestBLockData is: ', latestBlockData)
    latestBlockHeight = latestBlockData.height
    // console.log('latestBlockHeight is: ', latestBlockHeight)
  } catch (e) {
    console.log('error: ', e)
    throw new Error()
  }
}


const mainRoutine = async () => {
  console.log('-----------------------------------------')
  try {
    await getLatestBlock()
    console.log('latestBlockHeight: ', latestBlockHeight)
    await fetchGrinPoolData(latestBlockHeight)
    issueCount = 0
  } catch (e) {
    console.log('error is: ', e)
    issueCount++
  }
}

const mainInterval = setInterval(async () => {
  await mainRoutine()
  console.log('inside setInterval, issueCount is: ', issueCount)  
  if (issueCount > 8 || (latestBlockHeight - poolBlockHeight > 12)) {
    playMusic()
  }
}, 60000)

playMusic = async () => {
  const Audio = createAudio()
  const myFile = await Audio(`./music.mp3`)
  await myFile.play()
  clearInterval(mainInterval)
}