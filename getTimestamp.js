const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");

console.log(`timestamp: ${timestamp}`);
