const { performance } = require('perf_hooks');

// Create a large array of messages
const messages = Array.from({ length: 10000 }).map((_, i) => ({
  role: i % 10 === 0 ? "user" : "ai",
  imageUrl: i % 10 === 0 ? `url-${i}` : undefined,
}));

// We make the target near the end so find() in reverse is fast,
// the bottleneck in old method is [...messages].reverse()
messages[9999] = { role: "user", imageUrl: "last-url" };

function testOld() {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    const lastUserImage = [...messages].reverse().find(m => m.role === "user" && m.imageUrl)?.imageUrl;
  }
  const end = performance.now();
  console.log(`Old: ${end - start} ms`);
}

function testNew() {
  const start = performance.now();
  for (let k = 0; k < 1000; k++) {
    let lastUserImage;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user" && messages[i].imageUrl) {
        lastUserImage = messages[i].imageUrl;
        break;
      }
    }
  }
  const end = performance.now();
  console.log(`New (loop): ${end - start} ms`);
}

function testFindLast() {
  const start = performance.now();
  for (let k = 0; k < 1000; k++) {
    const lastUserImage = messages.findLast(m => m.role === "user" && m.imageUrl)?.imageUrl;
  }
  const end = performance.now();
  console.log(`New (findLast): ${end - start} ms`);
}

testOld();
testNew();
testFindLast();
