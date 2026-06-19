// test_verify.js
const standards = require('./standards.js');
console.log('Available states/posts:');
Object.entries(standards).forEach(([stateKey, state]) => {
  console.log(`- ${state.name} (${stateKey}):`);
  Object.entries(state.posts).forEach(([postKey, post]) => {
    console.log(`   * ${post.name} (${postKey})`);
  });
});
