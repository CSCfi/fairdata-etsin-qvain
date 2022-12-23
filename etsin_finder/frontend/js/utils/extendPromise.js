// Add delay function to Promise
Promise.delay = ms => new Promise(resolve => setTimeout(resolve, ms))
