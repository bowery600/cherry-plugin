const fs = require('fs');
const content = fs.readFileSync('/app/Just the blocks plugin/cherrystone-blocks/src/blocks/portfolio-grid/render.php', 'utf-8');
if (content.includes('role="group"') && content.includes('aria-pressed="true"')) {
  console.log("Attributes found!");
} else {
  console.error("Attributes missing.");
  process.exit(1);
}
