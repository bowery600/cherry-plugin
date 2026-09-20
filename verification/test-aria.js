const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const html = `
  <html>
    <body>
		<div class="portfolio-filters">
			<div class="filter-group filter-status" role="group" aria-label="Filter by status">
				<button class="filter-btn active" data-filter-type="status" data-filter-val="Active" aria-pressed="true" id="btn-active">Active</button>
				<button class="filter-btn" data-filter-type="status" data-filter-val="Exit" aria-pressed="false" id="btn-exit">Exits</button>
			</div>
		</div>
        <div id="portfolio-grid">
           <div class="portfolio-card" data-status="Active"></div>
           <div class="portfolio-card" data-status="Exit"></div>
        </div>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const grid = document.getElementById('portfolio-grid');
            if (!grid) return;
            const cards = grid.querySelectorAll('.portfolio-card');
            const filterBtns = document.querySelectorAll('.filter-btn');
            let currentStatus = 'Active';
            let currentSector = 'All';

            function filterCards() {
                cards.forEach(card => {
                    const cardStatus = card.getAttribute('data-status');
                    const statusMatch = (currentStatus === 'All' || cardStatus === currentStatus);
                    if (statusMatch) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            }

            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const type = this.getAttribute('data-filter-type');
                    const val = this.getAttribute('data-filter-val');
                    const siblings = this.parentElement.querySelectorAll('.filter-btn');
                    siblings.forEach(s => {
                        s.classList.remove('active');
                        s.setAttribute('aria-pressed', 'false');
                    });
                    this.classList.add('active');
                    this.setAttribute('aria-pressed', 'true');
                    if (type === 'status') { currentStatus = val; }
                    filterCards();
                });
            });
            filterCards();
        });
        </script>
    </body>
  </html>
  `;

  await page.setContent(html);

  const exitBtn = await page.locator('#btn-exit');
  const activeBtn = await page.locator('#btn-active');

  let ariaPressed = await exitBtn.getAttribute('aria-pressed');
  console.log('Exit button aria-pressed (initial):', ariaPressed);

  await exitBtn.click();

  ariaPressed = await exitBtn.getAttribute('aria-pressed');
  console.log('Exit button aria-pressed (after click):', ariaPressed);

  const oldActiveAriaPressed = await activeBtn.getAttribute('aria-pressed');
  console.log('Active button aria-pressed (after click):', oldActiveAriaPressed);

  await browser.close();
})();
