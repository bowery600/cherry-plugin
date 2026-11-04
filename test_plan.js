const fs = require('fs');
const content = fs.readFileSync('/app/Just the blocks plugin/cherrystone-blocks/src/blocks/page-communications/render.php', 'utf8');
if (content.includes('aria-pressed')) {
  console.log('aria-pressed found');
} else {
  console.log('aria-pressed not found');
}
