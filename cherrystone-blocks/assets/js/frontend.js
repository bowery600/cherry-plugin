( function () {
	const ready = ( callback ) => {
		if ( document.readyState === 'loading' ) {
			document.addEventListener( 'DOMContentLoaded', callback );
			return;
		}

		callback();
	};

	const normalize = ( value ) => value.toLowerCase().trim();

	ready( () => {
		document
			.querySelectorAll( '[data-member-directory]' )
			.forEach( ( directory ) => {
				const search = directory.querySelector(
					'[data-member-directory-search]'
				);
				const count = directory.querySelector(
					'[data-member-directory-count]'
				);
				const cards = Array.from(
					directory.querySelectorAll( '[data-member-card]' )
				);

				if ( ! search || ! count || ! cards.length ) {
					return;
				}

				const empty = directory.querySelector(
					'[data-member-directory-empty]'
				);
				const total = cards.length;

				const update = () => {
					const query = search.value.trim().toLowerCase();
					let visible = 0;

					cards.forEach( ( card ) => {
						const text = card.dataset.search || '';
						const isMatch = ! query || text.includes( query );
						card.classList.toggle( 'is-hidden', ! isMatch );
						if ( isMatch ) {
							visible += 1;
						}
					} );

					count.textContent = `Showing ${ visible } of ${ total }`;
					if ( empty ) {
						empty.hidden = visible > 0;
					}
				};

				search.addEventListener( 'input', update );
				update();
			} );

		document
			.querySelectorAll( '.faq-accordion-section' )
			.forEach( ( section, sectionIndex ) => {
				const items = Array.from(
					section.querySelectorAll(
						'[data-faq-item], .faq-accordion-item'
					)
				);

				if ( ! items.length ) {
					return;
				}

				const search = section.querySelector( '.faq-search-input' );

				const setOpen = ( item, isOpen ) => {
					const trigger = item.querySelector(
						'.faq-accordion-trigger'
					);
					const panel = item.querySelector( '.faq-accordion-panel' );

					item.classList.toggle( 'is-open', isOpen );

					if ( trigger ) {
						trigger.setAttribute(
							'aria-expanded',
							isOpen ? 'true' : 'false'
						);
					}

					if ( panel ) {
						panel.hidden = ! isOpen;
					}
				};

				items.forEach( ( item, itemIndex ) => {
					const trigger = item.querySelector(
						'.faq-accordion-trigger'
					);
					const panel = item.querySelector( '.faq-accordion-panel' );

					if ( ! trigger || ! panel ) {
						return;
					}

					const panelId = `cherrystone-faq-${ sectionIndex }-${ itemIndex }`;
					panel.id = panel.id || panelId;
					trigger.setAttribute( 'aria-controls', panel.id );
					setOpen( item, item.classList.contains( 'is-open' ) );

					trigger.addEventListener( 'click', () => {
						const nextState =
							! item.classList.contains( 'is-open' );
						items.forEach( ( otherItem ) =>
							setOpen( otherItem, false )
						);
						setOpen( item, nextState );
					} );
				} );

				if ( search ) {
					search.addEventListener( 'input', () => {
						const query = normalize( search.value );
						let firstMatch = null;

						items.forEach( ( item ) => {
							const matches = normalize(
								item.textContent || ''
							).includes( query );
							item.hidden = query.length > 0 && ! matches;

							if ( matches && ! firstMatch ) {
								firstMatch = item;
							}
						} );

						if ( query.length && firstMatch ) {
							items.forEach( ( item ) => setOpen( item, false ) );
							setOpen( firstMatch, true );
						}
					} );
				}
			} );

		// ── Cherrystone form blocks (member interest + founder application) ──
		const utils =
			( typeof window !== 'undefined' && window.cherrystoneFormUtils ) ||
			null;

		const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const setFieldError = ( form, name, message ) => {
			const slot = form.querySelector( `[data-error-for="${ name }"]` );
			if ( slot ) {
				slot.textContent = message || '';
				slot.hidden = ! message;
			}
			form.querySelectorAll( `[name="${ name }"]` ).forEach( ( input ) => {
				if ( message ) {
					input.setAttribute( 'aria-invalid', 'true' );
				} else {
					input.removeAttribute( 'aria-invalid' );
				}
			} );
		};

		const checkedValues = ( form, name ) =>
			Array.from(
				form.querySelectorAll( `input[name="${ name }"]:checked` )
			).map( ( input ) => input.value );

		const fieldVal = ( form, name ) => {
			const el = form.querySelector( `[name="${ name }"]` );
			return el ? el.value.trim() : '';
		};

		const buildMemberLines = ( form ) => [
			'Hello Cherrystone team,',
			'',
			'I am interested in joining Cherrystone Angel Group as a member.',
			'',
			`Name: ${ fieldVal( form, 'name' ) }`,
			`Email: ${ fieldVal( form, 'email' ) }`,
			`Location: ${ fieldVal( form, 'location' ) || 'Not provided' }`,
			'',
			'Professional / investing background:',
			fieldVal( form, 'background' ),
			'',
			'Why I am interested in Cherrystone:',
			fieldVal( form, 'interest' ),
		];

		const buildApplyLines = ( form ) => [
			'Hello Cherrystone screening committee,',
			'',
			'Please consider the following application for capital.',
			'',
			`Founder name: ${ fieldVal( form, 'name' ) }`,
			`Email: ${ fieldVal( form, 'email' ) }`,
			`Company: ${ fieldVal( form, 'company' ) }`,
			`Website: ${ fieldVal( form, 'website' ) || 'Not provided' }`,
			`Stage: ${ checkedValues( form, 'stages' ).join( ', ' ) }`,
			`Verticals: ${ checkedValues( form, 'sectors' ).join( ', ' ) }`,
			`Amount raising: ${ fieldVal( form, 'amtRaising' ) }`,
			`Amount committed: ${
				fieldVal( form, 'amtCommitted' ) || 'Not provided'
			}`,
			`Deck: ${ fieldVal( form, 'deck' ) || 'Not provided' }`,
			`Referred by: ${ fieldVal( form, 'referral' ) || 'Not provided' }`,
			'',
			'What are you building, and who is it for?',
			fieldVal( form, 'whatBuilding' ),
			'',
			'Why now? Why you?',
			fieldVal( form, 'whyNow' ),
		];

		const validateMember = ( form ) => {
			let ok = true;
			[ 'name', 'background', 'interest' ].forEach( ( name ) => {
				const valid = !! fieldVal( form, name );
				setFieldError( form, name, valid ? '' : 'Required' );
				ok = ok && valid;
			} );
			const emailOk = EMAIL_RE.test( fieldVal( form, 'email' ) );
			setFieldError(
				form,
				'email',
				emailOk ? '' : 'Valid email required'
			);
			return ok && emailOk;
		};

		const validateApply = ( form ) => {
			let ok = true;
			[
				'name',
				'company',
				'amtRaising',
				'whatBuilding',
				'whyNow',
			].forEach( ( name ) => {
				const valid = !! fieldVal( form, name );
				setFieldError( form, name, valid ? '' : 'Required' );
				ok = ok && valid;
			} );
			const emailOk = EMAIL_RE.test( fieldVal( form, 'email' ) );
			setFieldError(
				form,
				'email',
				emailOk ? '' : 'Valid email required'
			);
			const stagesOk = checkedValues( form, 'stages' ).length > 0;
			setFieldError(
				form,
				'stages',
				stagesOk ? '' : 'Select at least one stage'
			);
			const sectorsOk = checkedValues( form, 'sectors' ).length > 0;
			setFieldError(
				form,
				'sectors',
				sectorsOk ? '' : 'Select at least one vertical'
			);
			return ok && emailOk && stagesOk && sectorsOk;
		};

		const APPLY_REQUIRED = 8;
		const updateApplyProgress = ( form ) => {
			const root =
				form.closest( '.cherrystone-page-apply-template' ) ||
				form.closest( '.cherrystone-form-block' );
			if ( ! root ) {
				return;
			}
			const done = [
				!! fieldVal( form, 'name' ),
				EMAIL_RE.test( fieldVal( form, 'email' ) ),
				!! fieldVal( form, 'company' ),
				checkedValues( form, 'stages' ).length > 0,
				checkedValues( form, 'sectors' ).length > 0,
				!! fieldVal( form, 'amtRaising' ),
				!! fieldVal( form, 'whatBuilding' ),
				!! fieldVal( form, 'whyNow' ),
			].filter( Boolean ).length;
			const pct = Math.round( ( done / APPLY_REQUIRED ) * 100 );
			const valueEl = root.querySelector(
				'[data-cherry-progress-value]'
			);
			const barEl = root.querySelector( '[data-cherry-progress-bar]' );
			const progressEl = root.querySelector(
				'[data-cherry-progress], [role="progressbar"]'
			);
			if ( valueEl ) {
				valueEl.textContent = `${ pct }%`;
			}
			if ( barEl ) {
				barEl.style.width = `${ pct }%`;
			}
			if ( progressEl ) {
				progressEl.setAttribute( 'aria-valuenow', String( pct ) );
			}
		};

		const showSuccess = ( form, lines ) => {
			const root = form.closest( '.cherrystone-form-block' );
			const success =
				root && root.querySelector( '[data-cherry-form-success]' );
			if ( success ) {
				form.hidden = true;
				success.hidden = false;
				if ( typeof success.focus === 'function' ) {
					success.focus();
				}
				const copyBtn = success.querySelector(
					'[data-cherry-form-copy]'
				);
				if ( copyBtn ) {
					copyBtn.addEventListener( 'click', () => {
						if ( navigator.clipboard ) {
							navigator.clipboard.writeText( lines.join( '\n' ) );
						}
						copyBtn.textContent = 'Copied to clipboard';
					} );
				}
			}
		};

		document.querySelectorAll( '[data-cherry-form]' ).forEach( ( form ) => {
			const kind = form.getAttribute( 'data-cherry-form' );
			const recipient =
				form.getAttribute( 'data-recipient' ) ||
				'info@cherrystoneangelgroup.com';

			// Associate each error slot with its field(s) so screen readers
			// announce the message via aria-describedby when it appears.
			form.querySelectorAll( '[data-error-for]' ).forEach( ( slot ) => {
				const name = slot.getAttribute( 'data-error-for' );
				if ( ! slot.id ) {
					slot.id = `cs-err-${ kind }-${ name }`;
				}
				slot.setAttribute( 'role', 'alert' );
				form.querySelectorAll( `[name="${ name }"]` ).forEach(
					( input ) => {
						const ids = ( input.getAttribute( 'aria-describedby' ) || '' )
							.split( ' ' )
							.filter( Boolean );
						if ( ids.indexOf( slot.id ) === -1 ) {
							ids.push( slot.id );
							input.setAttribute(
								'aria-describedby',
								ids.join( ' ' )
							);
						}
					}
				);
			} );

			if ( kind === 'founder-application' ) {
				updateApplyProgress( form );
				form.addEventListener( 'input', () =>
					updateApplyProgress( form )
				);
				form.addEventListener( 'change', () =>
					updateApplyProgress( form )
				);
			}

			form.addEventListener( 'submit', ( event ) => {
				event.preventDefault();
				const isApply = kind === 'founder-application';
				const valid = isApply
					? validateApply( form )
					: validateMember( form );
				if ( ! valid ) {
					const firstError = form.querySelector(
						'.field-error-msg:not([hidden])'
					);
					if ( firstError ) {
						const name =
							firstError.getAttribute( 'data-error-for' );
						const target = name
							? form.querySelector( `[name="${ name }"]` )
							: null;
						( target || firstError ).scrollIntoView( {
							behavior: 'smooth',
							block: 'center',
						} );
						if ( target && typeof target.focus === 'function' ) {
							target.focus( { preventScroll: true } );
						}
					}
					return;
				}
				const lines = isApply
					? buildApplyLines( form )
					: buildMemberLines( form );
				const subject = isApply
					? `Capital application: ${ fieldVal( form, 'company' ) }`
					: `Member interest: ${ fieldVal( form, 'name' ) }`;
				if ( utils ) {
					window.location.href = utils.buildMailto( {
						recipient,
						subject,
						lines,
					} );
				}
				showSuccess( form, lines );
			} );
		} );

		// ── Image Sequence Canvas Hero with Parallax (Gutenberg Block) ──
		const initImageSequenceHero = () => {
			const container = document.querySelector( '.sequence-hero-container' );
			if ( ! container ) {
				return;
			}

			const canvas = container.querySelector( '.sequence-canvas' );
			const preloader = document.querySelector( '.preloader-overlay' );
			const preloaderBar = preloader ? preloader.querySelector( '.preloader-bar' ) : null;
			const preloaderPct = preloader ? preloader.querySelector( '.preloader-percentage' ) : null;

			const kicker = container.querySelector( '.sequence-kicker' );
			const title = container.querySelector( '.sequence-title' );
			const sub = container.querySelector( '.sequence-sub' );
			const actions = container.querySelector( '.sequence-actions' );
			const indicator = container.querySelector( '.sequence-scroll-indicator' );

			if ( ! canvas ) {
				return;
			}

			const prefersReducedMotion =
				window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			const startFrame = 30;            // first frame to show (ignore frames 1–29)
			const lastFrame = 120;
			const frameCount = lastFrame - startFrame + 1;
			const images = [];
			const sequence = { frame: 0 };
			let loadedCount = 0;

			// Resolve frames from the plugin asset URL (provided via wp_localize_script).
			// A page-relative fallback keeps the static React build working unchanged.
			const framesBase = ( window.CherrystoneHero && window.CherrystoneHero.framesBase ) || 'frames/';
			const getFrameUrl = ( index ) => {
				const num = String( index + startFrame ).padStart( 3, '0' );
				return `${ framesBase }frame_${ num }.webp`;
			};

			const renderFrame = ( index ) => {
				const img = images[ index ];
				if ( ! img ) {
					return;
				}

				const ctx = canvas.getContext( '2d' );
				if ( ! ctx ) {
					return;
				}

				ctx.clearRect( 0, 0, canvas.width, canvas.height );

				const imgWidth = img.naturalWidth || img.width;
				const imgHeight = img.naturalHeight || img.height;
				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;

				const imgRatio = imgWidth / imgHeight;
				const canvasRatio = canvasWidth / canvasHeight;

				let drawWidth, drawHeight, drawX, drawY;

				if ( canvasRatio > imgRatio ) {
					drawWidth = canvasWidth;
					drawHeight = canvasWidth / imgRatio;
					drawX = 0;
					drawY = ( canvasHeight - drawHeight ) / 2;
				} else {
					drawWidth = canvasHeight * imgRatio;
					drawHeight = canvasHeight;
					drawX = ( canvasWidth - drawWidth ) / 2;
					drawY = 0;
				}

				ctx.drawImage( img, drawX, drawY, drawWidth, drawHeight );
			};

			const handleResize = () => {
				const rect = canvas.parentElement.getBoundingClientRect();
				const width = rect.width || window.innerWidth;
				const height = rect.height || window.innerHeight;

				canvas.style.width = `${ width }px`;
				canvas.style.height = `${ height }px`;

				const dpr = Math.min( window.devicePixelRatio || 1, 2 ); // cap at 2x for cheaper per-frame redraw
				canvas.width = width * dpr;
				canvas.height = height * dpr;

				renderFrame( Math.round( sequence.frame ) );

				// Keep pin/scrub bounds aligned with the new canvas size.
				if ( window.ScrollTrigger ) {
					window.ScrollTrigger.refresh();
				}
			};

			let heroResizeTimer = null;
			const onHeroResize = () => {
				window.clearTimeout( heroResizeTimer );
				heroResizeTimer = window.setTimeout( handleResize, 150 );
			};

			let gsapRetries = 0;
			const initGSAPScrollTrigger = () => {
				if ( prefersReducedMotion ) {
					// Respect reduced-motion: show a static hero frame with the
					// overlay text fully visible — no pin, scrub, or parallax.
					renderFrame( 0 );
					[ kicker, title, sub, actions, indicator ].forEach( ( el ) => {
						if ( el ) {
							el.style.opacity = '1';
							el.style.transform = 'none';
						}
					} );
					return;
				}
				if ( ! window.gsap || ! window.ScrollTrigger ) {
					// Bounded retry: ~30 × 50ms ≈ 1.5s, then give up gracefully
					// rather than recursing forever if GSAP never loads.
					gsapRetries += 1;
					if ( gsapRetries > 30 ) {
						// eslint-disable-next-line no-console
						console.warn(
							'Cherrystone hero: GSAP/ScrollTrigger did not load; showing static hero.'
						);
						renderFrame( 0 );
						[ kicker, title, sub, actions, indicator ].forEach( ( el ) => {
							if ( el ) {
								el.style.opacity = '1';
								el.style.transform = 'none';
							}
						} );
						return;
					}
					setTimeout( initGSAPScrollTrigger, 50 );
					return;
				}

				gsap.registerPlugin( ScrollTrigger );

				// Initial staggers
				gsap.fromTo(
					[ kicker, title, sub, actions, indicator ],
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
				);

				// Bind scrollbind timeline
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: container,
						start: 'top top',
						end: '+=150%',
						pin: true,
						scrub: 0.5,
						invalidateOnRefresh: true
					}
				});

				// Tween frame progress
				tl.to( sequence, {
					frame: frameCount - 1,
					snap: 'frame',
					ease: 'none',
					duration: 1,
					onUpdate: () => {
						renderFrame( Math.round( sequence.frame ) );
					}
				}, 0 );

				// Camera zoom parallax
				tl.to( canvas, {
					scale: 1.0,
					yPercent: 8,
					ease: 'none',
					duration: 1
				}, 0 );

				// Foreground parallax displacement
				tl.to( kicker, {
					yPercent: -180,
					opacity: 0,
					ease: 'power1.inOut',
					duration: 0.25
				}, 0 );

				tl.to( title, {
					yPercent: -90,
					opacity: 0,
					ease: 'power1.inOut',
					duration: 0.35
				}, 0.05 );

				tl.to( sub, {
					yPercent: -50,
					opacity: 0,
					ease: 'power1.inOut',
					duration: 0.30
				}, 0.10 );

				tl.to( actions, {
					yPercent: -30,
					opacity: 0,
					ease: 'power1.inOut',
					duration: 0.25
				}, 0.15 );

				tl.to( indicator, {
					opacity: 0,
					ease: 'power1.in',
					duration: 0.1
				}, 0 );

				gsap.set( canvas, { scale: 1.06, yPercent: 0 } );
			};

			const startPreloading = () => {
				for ( let i = 0; i < frameCount; i++ ) {
					const img = new Image();
					img.src = getFrameUrl( i );
					img.onload = () => {
						loadedCount++;
						const percent = Math.round( ( loadedCount / frameCount ) * 100 );
						
						if ( preloaderBar ) {
							preloaderBar.style.width = `${ percent }%`;
						}
						if ( preloaderPct ) {
							preloaderPct.textContent = `${ percent }%`;
						}

						if ( loadedCount === frameCount ) {
							// Finished preloading!
							handleResize();
							window.addEventListener( 'resize', onHeroResize, { passive: true } );
							
							setTimeout( () => {
								if ( preloader ) {
									preloader.classList.add( 'fade-out' );
								}
								// Initialize staggers and scroll parallax
								initGSAPScrollTrigger();
							}, 800 );
						}
					};
					img.onerror = () => {
						// Graceful fallback to avoid preloader hanging
						loadedCount++;
						const percent = Math.round( ( loadedCount / frameCount ) * 100 );
						if ( loadedCount === frameCount ) {
							handleResize();
							window.addEventListener( 'resize', onHeroResize, { passive: true } );
							setTimeout( () => {
								if ( preloader ) {
									preloader.classList.add( 'fade-out' );
								}
								initGSAPScrollTrigger();
							}, 800 );
						}
					};
					images[ i ] = img;
				}
			};

			startPreloading();
		};

		const initFounderCarousels = () => {
			const carouselReducedMotion =
				window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			document
				.querySelectorAll( '.founder-carousel-container' )
				.forEach( ( carousel ) => {
					const slides = Array.from(
						carousel.querySelectorAll( '.founder-testimonial-slide' )
					);
					const dots = Array.from(
						carousel.querySelectorAll( '.carousel-dot-indicator' )
					);

					if ( slides.length < 2 ) {
						return;
					}

					let current = 0;
					let timer = null;

					const goTo = ( index ) => {
						current = ( index + slides.length ) % slides.length;
						slides.forEach( ( slide, i ) => {
							slide.classList.toggle( 'is-active', i === current );
						} );
						dots.forEach( ( dot, i ) => {
							const active = i === current;
							dot.classList.toggle( 'is-active', active );
							if ( active ) {
								dot.setAttribute( 'aria-current', 'true' );
							} else {
								dot.removeAttribute( 'aria-current' );
							}
						} );
					};

					const stop = () => {
						if ( timer ) {
							window.clearInterval( timer );
							timer = null;
						}
					};

					const start = () => {
						if (
							carouselReducedMotion ||
							carousel.dataset.autoplay !== 'true'
						) {
							return;
						}
						stop();
						timer = window.setInterval(
							() => goTo( current + 1 ),
							6000
						);
					};

					dots.forEach( ( dot, i ) => {
						dot.addEventListener( 'click', () => {
							goTo( i );
							start(); // restart the autoplay cadence after manual nav
						} );
					} );

					// Arrow-key navigation when focus is within the carousel.
					carousel.addEventListener( 'keydown', ( event ) => {
						if ( event.key === 'ArrowLeft' ) {
							event.preventDefault();
							goTo( current - 1 );
							start();
						} else if ( event.key === 'ArrowRight' ) {
							event.preventDefault();
							goTo( current + 1 );
							start();
						}
					} );

					// Pause while hovered or focused, resume on leave.
					carousel.addEventListener( 'mouseenter', stop );
					carousel.addEventListener( 'mouseleave', start );
					carousel.addEventListener( 'focusin', stop );
					carousel.addEventListener( 'focusout', start );

					goTo( 0 );
					start();
				} );
		};

		const initPitchCalculators = () => {
			// Transparent, tunable scoring weights — adjust to match Cherrystone's
			// real thesis. Each dimension is scored 0–100, then weighted.
			const STAGE_SCORES = { 'Pre-seed': 100, Seed: 100, 'Series A': 55, Late: 20 };
			const ROOTS_SCORES = { 'New England': 100, Expansion: 60, None: 15 };
			const SECTOR_SCORES = { LifeSciences: 100, DeepTech: 90, SaaS: 70, Other: 50 };
			const WEIGHTS = { stage: 0.3, roots: 0.3, sector: 0.25, amount: 0.15 };

			const amountScore = ( v ) => {
				if ( v <= 250000 ) {
					return 60 + ( ( v - 100000 ) / 150000 ) * 40; // 60 -> 100
				}
				if ( v <= 1500000 ) {
					return 100; // sweet spot
				}
				return 100 - ( ( v - 1500000 ) / 1000000 ) * 45; // 100 -> 55
			};

			const formatAmount = ( v ) => `$${ ( v / 1000000 ).toFixed( 2 ) }M`;

			const statusFor = ( score ) => {
				if ( score >= 80 ) {
					return {
						label: 'STRONG',
						feedback:
							"Your profile maps closely to Cherrystone's focus — early-stage, New England-rooted companies in our core sectors. A strong candidate to apply.",
					};
				}
				if ( score >= 62 ) {
					return {
						label: 'PROMISING',
						feedback:
							"A promising fit. A few inputs sit outside our sweet spot, but it's well worth starting a conversation.",
					};
				}
				if ( score >= 45 ) {
					return {
						label: 'EXPLORATORY',
						feedback:
							'Partial alignment. We occasionally invest outside our core focus — reach out if the other criteria are a strong match.',
					};
				}
				return {
					label: 'EARLY',
					feedback:
						'This profile sits outside our typical focus on early-stage New England companies. We may not be the right fit right now.',
				};
			};

			document
				.querySelectorAll( '.calculator-wrapper' )
				.forEach( ( wrapper ) => {
					const slider = wrapper.querySelector(
						'#calc-amt-slider, .calc-range-slider'
					);
					const amtDisplay =
						wrapper.querySelector( '#calc-amt-display' );
					const scoreDisplay =
						wrapper.querySelector( '#calc-score-display' );
					const scoreStatus =
						wrapper.querySelector( '#calc-score-status' );
					const scoreRing =
						wrapper.querySelector( '#calc-score-ring' );
					const feedback =
						wrapper.querySelector( '#calc-feedback-text' );

					const selectedValue = ( gridId ) => {
						const grid = wrapper.querySelector( '#' + gridId );
						const active = grid
							? grid.querySelector(
									'.calc-selector-btn.is-active'
							  )
							: null;
						return active ? active.dataset.value : null;
					};

					const recompute = () => {
						const sector = selectedValue( 'calc-sector-grid' );
						const stage = selectedValue( 'calc-stage-grid' );
						const roots = selectedValue( 'calc-roots-grid' );
						const amount = slider ? Number( slider.value ) : 500000;

						const raw =
							( STAGE_SCORES[ stage ] || 50 ) * WEIGHTS.stage +
							( ROOTS_SCORES[ roots ] || 50 ) * WEIGHTS.roots +
							( SECTOR_SCORES[ sector ] || 50 ) * WEIGHTS.sector +
							amountScore( amount ) * WEIGHTS.amount;
						const score = Math.round( raw );
						const status = statusFor( score );

						if ( scoreDisplay ) {
							scoreDisplay.textContent = `${ score }%`;
						}
						if ( scoreStatus ) {
							scoreStatus.textContent = status.label;
						}
						if ( feedback ) {
							feedback.textContent = status.feedback;
						}
						if ( scoreRing ) {
							const circumference = 283; // ~2πr for r=45
							scoreRing.style.strokeDashoffset = String(
								Math.round(
									circumference * ( 1 - score / 100 )
								)
							);
						}
					};

					if ( slider ) {
						const updateAmt = () => {
							const text = formatAmount( Number( slider.value ) );
							if ( amtDisplay ) {
								amtDisplay.textContent = text;
							}
							slider.setAttribute( 'aria-valuetext', text );
							recompute();
						};
						slider.addEventListener( 'input', updateAmt );
						updateAmt();
					}

					wrapper
						.querySelectorAll( '.calc-radio-grid' )
						.forEach( ( grid ) => {
							const radios = Array.from(
								grid.querySelectorAll( '.calc-selector-btn' )
							);

							const select = ( btn, moveFocus ) => {
								radios.forEach( ( r ) => {
									const active = r === btn;
									r.classList.toggle( 'is-active', active );
									r.setAttribute(
										'aria-checked',
										active ? 'true' : 'false'
									);
									r.tabIndex = active ? 0 : -1;
								} );
								if ( moveFocus ) {
									btn.focus();
								}
								recompute();
							};

							radios.forEach( ( r ) => {
								r.tabIndex = r.classList.contains( 'is-active' )
									? 0
									: -1;
								r.addEventListener( 'click', () =>
									select( r, false )
								);
								r.addEventListener( 'keydown', ( event ) => {
									const i = radios.indexOf( r );
									if (
										event.key === 'ArrowRight' ||
										event.key === 'ArrowDown'
									) {
										event.preventDefault();
										select(
											radios[ ( i + 1 ) % radios.length ],
											true
										);
									} else if (
										event.key === 'ArrowLeft' ||
										event.key === 'ArrowUp'
									) {
										event.preventDefault();
										select(
											radios[
												( i - 1 + radios.length ) %
													radios.length
											],
											true
										);
									}
								} );
							} );
						} );

					recompute();
				} );
		};

		const initSponsorCarousels = () => {
			const reducedMotion =
				window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			document
				.querySelectorAll( '.sponsor-carousel' )
				.forEach( ( carousel ) => {
					const viewport = carousel.querySelector(
						'.sponsor-carousel-viewport'
					);
					const track = carousel.querySelector(
						'.sponsor-carousel-track'
					);
					const dotsWrap = carousel.querySelector(
						'.sponsor-carousel-dots'
					);
					const prevBtn = carousel.querySelector(
						'.sponsor-carousel-arrow[data-dir="prev"]'
					);
					const nextBtn = carousel.querySelector(
						'.sponsor-carousel-arrow[data-dir="next"]'
					);
					if ( ! viewport || ! track ) {
						return;
					}

					const cards = Array.from(
						track.querySelectorAll( '.sponsor-card' )
					);
					if ( ! cards.length ) {
						return;
					}

					let page = 0;
					let pages = 1;
					let perView = 1;
					let timer = null;

					const stopAutoplay = () => {
						if ( timer ) {
							window.clearInterval( timer );
							timer = null;
						}
					};

					const startAutoplay = () => {
						if ( reducedMotion || pages < 2 ) {
							return;
						}
						stopAutoplay();
						timer = window.setInterval(
							() => goToPage( page + 1, true ),
							5200
						);
					};

					// Derive how many cards fit per view from the real card
					// width + flex gap, so it always matches the CSS breakpoints.
					const measurePerView = () => {
						const card = cards[ 0 ];
						const cardWidth = card.getBoundingClientRect().width;
						const styles = window.getComputedStyle( track );
						const gap =
							parseFloat( styles.columnGap || styles.gap ) || 0;
						const step = cardWidth + gap;
						if ( step <= 0 ) {
							return 1;
						}
						return Math.max(
							1,
							Math.round(
								( viewport.clientWidth + gap ) / step
							)
						);
					};

					const buildDots = () => {
						if ( ! dotsWrap ) {
							return;
						}
						dotsWrap.textContent = '';
						for ( let i = 0; i < pages; i++ ) {
							const dot = document.createElement( 'button' );
							dot.type = 'button';
							dot.className = 'carousel-dot-indicator';
							dot.setAttribute(
								'aria-label',
								'Go to page ' + ( i + 1 )
							);
							dot.addEventListener( 'click', () => {
								goToPage( i );
								startAutoplay();
							} );
							dotsWrap.appendChild( dot );
						}
					};

					const updateControls = () => {
						const hasPaging = pages > 1;
						[ prevBtn, nextBtn ].forEach( ( btn ) => {
							if ( btn ) {
								btn.hidden = ! hasPaging;
							}
						} );
						if ( dotsWrap ) {
							dotsWrap.hidden = ! hasPaging;
						}
						if ( prevBtn ) {
							prevBtn.disabled = page <= 0;
						}
						if ( nextBtn ) {
							nextBtn.disabled = page >= pages - 1;
						}
						if ( dotsWrap ) {
							Array.from( dotsWrap.children ).forEach(
								( dot, i ) => {
									const active = i === page;
									dot.classList.toggle( 'is-active', active );
									if ( active ) {
										dot.setAttribute(
											'aria-current',
											'true'
										);
									} else {
										dot.removeAttribute( 'aria-current' );
									}
								}
							);
						}
					};

					const applyTransform = () => {
						track.style.transform =
							'translateX(' +
							-page * viewport.clientWidth +
							'px)';
					};

					function goToPage( index, wrap = false ) {
						if ( wrap ) {
							page = ( index + pages ) % pages;
						} else {
							page = Math.max( 0, Math.min( index, pages - 1 ) );
						}
						applyTransform();
						updateControls();
					}

					const recompute = () => {
						perView = measurePerView();
						pages = Math.max( 1, Math.ceil( cards.length / perView ) );
						buildDots();
						if ( page > pages - 1 ) {
							page = pages - 1;
						}
						applyTransform();
						updateControls();
						startAutoplay();
					};

					if ( reducedMotion ) {
						track.style.transition = 'none';
					}

					if ( prevBtn ) {
						prevBtn.addEventListener( 'click', () => {
							goToPage( page - 1 );
							startAutoplay();
						} );
					}
					if ( nextBtn ) {
						nextBtn.addEventListener( 'click', () => {
							goToPage( page + 1 );
							startAutoplay();
						} );
					}

					// Keyboard paging when focus is within the carousel.
					carousel.addEventListener( 'keydown', ( event ) => {
						if ( event.key === 'ArrowLeft' ) {
							event.preventDefault();
							goToPage( page - 1 );
							startAutoplay();
						} else if ( event.key === 'ArrowRight' ) {
							event.preventDefault();
							goToPage( page + 1 );
							startAutoplay();
						}
					} );

					carousel.addEventListener( 'mouseenter', stopAutoplay );
					carousel.addEventListener( 'mouseleave', startAutoplay );
					carousel.addEventListener( 'focusin', stopAutoplay );
					carousel.addEventListener( 'focusout', startAutoplay );

					// Pointer / touch swipe.
					let startX = 0;
					let dragging = false;
					viewport.addEventListener(
						'pointerdown',
						( event ) => {
							dragging = true;
							startX = event.clientX;
						},
						{ passive: true }
					);
					const endDrag = ( event ) => {
						if ( ! dragging ) {
							return;
						}
						dragging = false;
						const delta = event.clientX - startX;
						if ( Math.abs( delta ) > 40 ) {
							goToPage( delta < 0 ? page + 1 : page - 1 );
							startAutoplay();
						}
					};
					viewport.addEventListener( 'pointerup', endDrag, {
						passive: true,
					} );
					viewport.addEventListener( 'pointercancel', () => {
						dragging = false;
					} );

					let resizeTimer = null;
					window.addEventListener(
						'resize',
						() => {
							window.clearTimeout( resizeTimer );
							resizeTimer = window.setTimeout( recompute, 150 );
						},
						{ passive: true }
					);

					recompute();
				} );
		};

		const initDiligenceTimelines = () => {
			document
				.querySelectorAll( '.diligence-timeline-section' )
				.forEach( ( section ) => {
					const trackProgress = section.querySelector(
						'.timeline-track-progress'
					);
					const steps = Array.from(
						section.querySelectorAll( '.timeline-step' )
					);
					if ( ! steps.length ) {
						return;
					}

					const setActive = ( activeIndex ) => {
						steps.forEach( ( step, idx ) => {
							step.classList.toggle( 'is-active', idx === activeIndex );
						} );
						if ( trackProgress ) {
							const percentage =
								( activeIndex / ( steps.length - 1 ) ) * 100;
							trackProgress.style.width = `${ percentage }%`;
						}
					};

					let activeIndex = steps.findIndex( ( step ) =>
						step.classList.contains( 'is-active' )
					);
					if ( activeIndex === -1 ) {
						activeIndex = 2; // Default to step 3 (0-indexed 2)
					}

					setActive( activeIndex );

					steps.forEach( ( step, idx ) => {
						step.addEventListener( 'click', () => {
							setActive( idx );
						} );
						step.addEventListener( 'keydown', ( event ) => {
							if ( event.key === 'Enter' || event.key === ' ' ) {
								event.preventDefault();
								setActive( idx );
							}
						} );
					} );
				} );
		};

		const initCardParallax = () => {
			document
				.querySelectorAll( '.vertical-showcase-card, .portfolio-card' )
				.forEach( ( card ) => {
					const handleMouseMove = ( e ) => {
						const rect = card.getBoundingClientRect();
						const x = ( ( e.clientX - rect.left ) / rect.width - 0.5 ) * 2;
						const y = ( ( e.clientY - rect.top ) / rect.height - 0.5 ) * 2;
						card.style.setProperty( '--px', x.toFixed( 3 ) );
						card.style.setProperty( '--py', y.toFixed( 3 ) );
					};
					const reset = () => {
						card.style.setProperty( '--px', '0' );
						card.style.setProperty( '--py', '0' );
					};
					card.addEventListener( 'mousemove', handleMouseMove );
					card.addEventListener( 'mouseleave', reset );
					card.addEventListener( 'blur', reset );
				} );
		};

		const initResourceTabs = () => {
			document.querySelectorAll( '.resource-tabs' ).forEach( ( tabContainer ) => {
				const chips = tabContainer.querySelectorAll( '.chip' );
				const section = tabContainer.closest( 'section' );
				const cards = section ? section.querySelectorAll( '.value-card' ) : [];

				chips.forEach( ( chip ) => {
					chip.addEventListener( 'click', () => {
						chips.forEach( ( c ) => c.classList.remove( 'active' ) );
						chip.classList.add( 'active' );

						const filter = chip.getAttribute( 'data-filter' );
						cards.forEach( ( card ) => {
							const cardTag = card.getAttribute( 'data-tag' );
							if ( filter === 'all' || cardTag === filter ) {
								card.style.display = '';
							} else {
								card.style.display = 'none';
							}
						} );
					} );
				} );
			} );
		};

		initFounderCarousels();
		initPitchCalculators();
		initImageSequenceHero();
		initSponsorCarousels();
		initDiligenceTimelines();
		initCardParallax();
		initResourceTabs();
	} );
} )();
