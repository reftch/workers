const { Worker } = require('worker_threads')
const jobs = Array.from({ length: 100 }, () => 1e9)

function chunkify(array, n) {
  let chunks = []
  for (let i = n; i > 0; i--) {
    chunks.push(array.splice(0, Math.ceil(array.length / i)))
  }
  return chunks
}

function run(jobs, concurrentWorkers) {
  const chunks = chunkify(jobs, concurrentWorkers)

  const tick = performance.now()
  let completedWorkers = 0

  chunks.forEach((data, i) => {
    const worker = new Worker('./src/worker.js')
    worker.postMessage(data)

    console.log(`Worker ${i} started`)
    
    worker.on('message', () => {
      console.log(`Worker ${i} completed`)
      completedWorkers++
      if (completedWorkers === concurrentWorkers) {
        console.log(`${concurrentWorkers} workers took ${performance.now() - tick} ms`)
        process.exit()
      }
    })
  })
}

run(jobs, 12)