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
						// CSS grid-template-rows transition handles visibility
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
			form.querySelectorAll( `[name="${ name }"]` ).forEach(
				( input ) => {
					if ( message ) {
						input.setAttribute( 'aria-invalid', 'true' );
					} else {
						input.removeAttribute( 'aria-invalid' );
					}
				}
			);
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
			return (
				validateStep( form, 1 ) &&
				validateStep( form, 2 ) &&
				validateStep( form, 3 ) &&
				validateStep( form, 4 )
			);
		};

		const validateStep = ( form, stepIndex ) => {
			let ok = true;
			const stepEl = form.querySelector(
				`.form-step[data-step="${ stepIndex }"]`
			);
			if ( ! stepEl ) {
				return true;
			}

			const requiredFields = stepEl.querySelectorAll( '[data-required]' );
			requiredFields.forEach( ( field ) => {
				const name = field.getAttribute( 'name' );
				if ( name ) {
					const valid = !! fieldVal( form, name );
					setFieldError( form, name, valid ? '' : 'Required' );
					ok = ok && valid;
				}
			} );

			if ( stepIndex === 1 ) {
				const emailOk = EMAIL_RE.test( fieldVal( form, 'email' ) );
				setFieldError(
					form,
					'email',
					emailOk ? '' : 'Valid email required'
				);
				ok = ok && emailOk;
			} else if ( stepIndex === 2 ) {
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
				ok = ok && stagesOk && sectorsOk;
			}
			return ok;
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
						const ids = (
							input.getAttribute( 'aria-describedby' ) || ''
						)
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
				let currentStep = 1;
				const totalSteps = 4;
				const steps = form.querySelectorAll( '.form-step' );
				const labels = form.querySelectorAll( '.step-label' );
				const progressBar = form.querySelector(
					'[data-cherry-progress-bar]'
				);

				const showStep = ( stepIndex ) => {
					steps.forEach(
						( s ) =>
							( s.hidden =
								parseInt( s.dataset.step ) !== stepIndex )
					);
					steps.forEach( ( s ) =>
						s.classList.toggle(
							'is-active',
							parseInt( s.dataset.step ) === stepIndex
						)
					);
					labels.forEach( ( l ) =>
						l.classList.toggle(
							'is-active',
							parseInt( l.dataset.stepLabel ) === stepIndex
						)
					);
					if ( progressBar ) {
						progressBar.style.width = `${
							( stepIndex / totalSteps ) * 100
						}%`;
					}
					const firstInput = form.querySelector(
						`.form-step[data-step="${ stepIndex }"] input, .form-step[data-step="${ stepIndex }"] textarea`
					);
					if ( firstInput ) {
						firstInput.focus();
					}
				};

				form.querySelectorAll( '.btn-next' ).forEach( ( btn ) => {
					btn.addEventListener( 'click', () => {
						if ( validateStep( form, currentStep ) ) {
							currentStep++;
							showStep( currentStep );
						} else {
							const firstError = form.querySelector(
								`.form-step[data-step="${ currentStep }"] .field-error-msg:not([hidden])`
							);
							if ( firstError ) {
								const name =
									firstError.getAttribute( 'data-error-for' );
								const target = name
									? form.querySelector( `[name="${ name }"]` )
									: null;
								if ( target ) {
									target.focus();
								}
							}
						}
					} );
				} );

				form.querySelectorAll( '.btn-prev' ).forEach( ( btn ) => {
					btn.addEventListener( 'click', () => {
						if ( currentStep > 1 ) {
							currentStep--;
							showStep( currentStep );
						}
					} );
				} );

				showStep( 1 );
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

		// ── Image Sequence Canvas Hero deprecated under Unified Root Canvas Protocol ──

		const initFounderCarousels = () => {
			const carouselReducedMotion =
				window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			document
				.querySelectorAll( '.founder-carousel-container' )
				.forEach( ( carousel ) => {
					const slides = Array.from(
						carousel.querySelectorAll(
							'.founder-testimonial-slide'
						)
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
							slide.classList.toggle(
								'is-active',
								i === current
							);
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
			const STAGE_SCORES = {
				'Pre-seed': 100,
				Seed: 100,
				'Series A': 55,
				Late: 20,
			};
			const ROOTS_SCORES = {
				'New England': 100,
				Expansion: 60,
				None: 15,
			};
			const SECTOR_SCORES = {
				LifeSciences: 100,
				DeepTech: 90,
				SaaS: 70,
				Other: 50,
			};
			const WEIGHTS = {
				stage: 0.3,
				roots: 0.3,
				sector: 0.25,
				amount: 0.15,
			};

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
					const scoreDisplay = wrapper.querySelector(
						'#calc-score-display'
					);
					const scoreStatus =
						wrapper.querySelector( '#calc-score-status' );
					const scoreRing =
						wrapper.querySelector( '#calc-score-ring' );
					const feedback = wrapper.querySelector(
						'#calc-feedback-text'
					);

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
							step.classList.toggle(
								'is-active',
								idx === activeIndex
							);
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

		const initResourceTabs = () => {
			document
				.querySelectorAll( '.resource-tabs' )
				.forEach( ( tabContainer ) => {
					const chips = tabContainer.querySelectorAll( '.chip' );
					const section = tabContainer.closest( 'section' );
					const cards = section
						? section.querySelectorAll( '.value-card' )
						: [];

					// Initialise cards for transitions
					cards.forEach( ( card ) => {
						card.style.transition =
							'opacity 0.22s ease-out, transform 0.22s ease-out';
					} );

					chips.forEach( ( chip ) => {
						chip.addEventListener( 'click', () => {
							chips.forEach( ( c ) =>
								c.classList.remove( 'active' )
							);
							chip.classList.add( 'active' );

							const filter = chip.getAttribute( 'data-filter' );
							cards.forEach( ( card ) => {
								const cardTag = card.getAttribute( 'data-tag' );
								const shouldShow =
									filter === 'all' || cardTag === filter;
								if ( shouldShow ) {
									card.style.display = '';
									// Force reflow before transition
									void card.offsetHeight;
									card.style.opacity = '1';
									card.style.transform = 'scale(1)';
								} else {
									card.style.opacity = '0';
									card.style.transform = 'scale(0.95)';
									setTimeout( () => {
										if ( card.style.opacity === '0' ) {
											card.style.display = 'none';
										}
									}, 220 );
								}
							} );
						} );
					} );
				} );
		};

		const initVideoScrollHero = () => {
			const hero = document.querySelector( '.sequence-hero-container' );
			if ( ! hero ) {
				return;
			}

			const preloader = document.querySelector( '.preloader-overlay' );
			const bar = document.querySelector( '.preloader-bar' );
			const pctEl = document.querySelector( '.preloader-percentage' );

			const hidePreloader = () => {
				if ( preloader ) {
					preloader.classList.add( 'fade-out' );
				}
			};

			const reducedMotion =
				window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			const isMobile = window.matchMedia( '(max-width: 1023px)' ).matches;

			if ( isMobile ) {
				// ── Mobile Path: Canvas WebP Frame Sequence ──────────────────
				const videoContainer = hero.querySelector(
					'.sequence-video-container'
				);
				const videoEl = hero.querySelector( '.sequence-video' );
				if ( videoContainer ) {
					videoContainer.style.display = 'none';
				}
				if ( videoEl ) {
					videoEl.removeAttribute( 'src' );
					videoEl.load();
				}

				// Dynamically create the canvas container (mirrors the old markup).
				let canvasContainer = hero.querySelector(
					'.sequence-canvas-container'
				);
				if ( ! canvasContainer ) {
					canvasContainer = document.createElement( 'div' );
					canvasContainer.className = 'sequence-canvas-container';
					hero.prepend( canvasContainer );
				}
				let canvas =
					canvasContainer.querySelector( '.sequence-canvas' );
				if ( ! canvas ) {
					canvas = document.createElement( 'canvas' );
					canvas.className = 'sequence-canvas';
					canvasContainer.appendChild( canvas );
				}

				const context = canvas.getContext( '2d' );
				if ( ! context ) {
					document.body.classList.add( 'no-webgl' );
					hidePreloader();
					return;
				}

				// ── Frame sequence settings ────────────────────────────────────
				const frameStart = 30;
				const frameEnd = 120;
				const frameCount = frameEnd - frameStart + 1;
				const frameBase =
					hero.getAttribute( 'data-frame-base' ) ||
					'/wp-content/uploads/cherrystone-frames/';
				// ─────────────────────────────────────────────────────────────

				const frames = new Array( frameCount );
				let loaded = 0;
				let firstDrawable = null;
				let currentFrame = 0;
				let lastFrameTime = 0;
				let firstPassDone = false;
				const loopStart = frameCount - 15;

				const padFrame = ( i ) => String( i ).padStart( 3, '0' );
				const frameUrl = ( i ) =>
					`${ frameBase }frame_${ padFrame( i ) }.webp`;

				const setProgress = () => {
					const progress = Math.round(
						( loaded / frameCount ) * 100
					);
					if ( bar ) {
						bar.style.width = `${ progress }%`;
					}
					if ( pctEl ) {
						pctEl.textContent = `${ progress }%`;
					}
				};

				const resize = () => {
					const rect = hero.getBoundingClientRect();
					const pixelRatio = Math.min(
						window.devicePixelRatio || 1,
						2
					);
					const w = Math.max( 1, Math.round( rect.width ) );
					const h = Math.max( 1, Math.round( rect.height ) );
					canvas.width = Math.round( w * pixelRatio );
					canvas.height = Math.round( h * pixelRatio );
					canvas.style.width = `${ w }px`;
					canvas.style.height = `${ h }px`;
					context.setTransform( pixelRatio, 0, 0, pixelRatio, 0, 0 );
					drawFrame( frames[ currentFrame ] || firstDrawable );
				};

				const drawFrame = ( image ) => {
					if ( ! image ) {
						return;
					}
					const w = canvas.clientWidth;
					const h = canvas.clientHeight;
					const scale = Math.max(
						w / image.naturalWidth,
						h / image.naturalHeight
					);
					const dw = image.naturalWidth * scale;
					const dh = image.naturalHeight * scale;
					context.clearRect( 0, 0, w, h );
					context.drawImage(
						image,
						( w - dw ) / 2,
						( h - dh ) / 2,
						dw,
						dh
					);
				};

				const animate = ( timestamp ) => {
					if ( loaded === 0 ) {
						window.requestAnimationFrame( animate );
						return;
					}
					if ( timestamp - lastFrameTime >= 1000 / 24 ) {
						currentFrame += 1;
						if ( ! firstPassDone ) {
							if ( currentFrame >= frameCount ) {
								currentFrame = loopStart;
								firstPassDone = true;
							}
						} else if ( currentFrame >= frameCount ) {
							currentFrame = loopStart;
						}
						drawFrame( frames[ currentFrame ] || firstDrawable );
						lastFrameTime = timestamp;
					}
					window.requestAnimationFrame( animate );
				};

				window.addEventListener( 'resize', resize, { passive: true } );
				resize();

				// Load all frames
				for ( let f = frameStart; f <= frameEnd; f += 1 ) {
					const img = new Image();
					const idx = f - frameStart;
					img.decoding = 'async';
					img.src = frameUrl( f );
					img.onload = () => {
						frames[ idx ] = img;
						loaded += 1;
						if ( ! firstDrawable ) {
							firstDrawable = img;
							currentFrame = idx;
							resize();
							hidePreloader();
						}
						setProgress();
						if ( loaded === frameCount ) {
							hidePreloader();
						}
					};
					img.onerror = () => {
						loaded += 1;
						setProgress();
						if ( loaded === frameCount ) {
							hidePreloader();
						}
					};
				}

				if ( ! reducedMotion ) {
					if (
						typeof window.gsap !== 'undefined' &&
						typeof window.ScrollTrigger !== 'undefined'
					) {
						window.gsap.registerPlugin( window.ScrollTrigger );
						const scrollLength = window.innerHeight * 5;
						const animObj = { frame: 0 };
						window.gsap.to( animObj, {
							frame: frameCount - 1,
							snap: 'frame',
							ease: 'none',
							scrollTrigger: {
								trigger: hero,
								start: 'top top',
								end: `+=${ scrollLength }`,
								pin: true,
								anticipatePin: 1,
								scrub: 0.5,
							},
							onUpdate: () => {
								const f = Math.round( animObj.frame );
								drawFrame( frames[ f ] || firstDrawable );
							},
						} );
					} else {
						window.requestAnimationFrame( animate );
					}
				}

				return; // Mobile path done
			}

			// ── Desktop Path: GSAP ScrollTrigger + WebM Video ────────────────
			if (
				typeof window.gsap === 'undefined' ||
				typeof window.ScrollTrigger === 'undefined'
			) {
				hidePreloader();
				return;
			}

			const video = hero.querySelector( '.sequence-video' );
			if ( ! video ) {
				hidePreloader();
				return;
			}

			// Ensure the video container and element are displayed
			const videoContainer = hero.querySelector(
				'.sequence-video-container'
			);
			if ( videoContainer ) {
				videoContainer.style.display = '';
			}

			// Hide canvas container if it exists
			const canvasContainer = hero.querySelector(
				'.sequence-canvas-container'
			);
			if ( canvasContainer ) {
				canvasContainer.style.display = 'none';
			}

			// Append cache buster to prevent HTTP 416 Range Not Satisfiable caching issues
			const originalSrc = video.getAttribute( 'src' );
			if ( originalSrc && ! originalSrc.includes( 'v=' ) ) {
				const separator = originalSrc.includes( '?' ) ? '&' : '?';
				video.setAttribute(
					'src',
					`${ originalSrc }${ separator }v=1440p-g1`
				);
				video.load();
			}

			window.gsap.registerPlugin( window.ScrollTrigger );

			// Prevent the browser auto-playing; we control currentTime directly.
			video.pause();
			video.currentTime = 0;

			if ( reducedMotion ) {
				hidePreloader();
				return;
			}

			const setupScrollTrigger = () => {
				const duration = video.duration || 6;
				const scrollLength = window.innerHeight * 5;

				// Directly scrub the video's currentTime property.
				// Since we encoded the video as all keyframes (-g 1) and compressed it,
				// the browser's hardware video decoder can update instantaneously without lag.
				window.gsap.to( video, {
					currentTime: duration,
					ease: 'none',
					scrollTrigger: {
						trigger: hero,
						start: 'top top',
						end: `+=${ scrollLength }`,
						pin: true,
						anticipatePin: 1,
						scrub: 0.5,
					},
				} );

				hidePreloader();
			};

			// Track download progress in the preloader bar.
			video.addEventListener( 'progress', () => {
				if ( ! video.duration || ! video.buffered.length ) {
					return;
				}
				const pct = Math.round(
					( video.buffered.end( video.buffered.length - 1 ) /
						video.duration ) *
						100
				);
				if ( bar ) {
					bar.style.width = `${ pct }%`;
				}
				if ( pctEl ) {
					pctEl.textContent = `${ pct }%`;
				}
			} );

			video.addEventListener( 'canplaythrough', hidePreloader, {
				once: true,
			} );

			// Fallback: hide after 4 s on slow connections.
			const fallback = setTimeout( hidePreloader, 4000 );
			video.addEventListener(
				'canplaythrough',
				() => clearTimeout( fallback ),
				{ once: true }
			);

			if ( video.readyState >= /* HAVE_METADATA */ 1 ) {
				setupScrollTrigger();
			} else {
				video.addEventListener( 'loadedmetadata', setupScrollTrigger, {
					once: true,
				} );
			}
		};

		const initBioDrawers = () => {
			document
				.querySelectorAll( '.cs-bio-drawers-container' )
				.forEach( ( container ) => {
					const triggers = Array.from(
						document.querySelectorAll( '.cs-bio-trigger' )
					);
					const drawers = Array.from(
						container.querySelectorAll( '.cs-bio-drawer' )
					);
					const backdrop =
						container.querySelector( '.cs-bio-backdrop' );

					if ( ! triggers.length || ! drawers.length || ! backdrop ) {
						return;
					}

					const closeAll = () => {
						drawers.forEach( ( drawer ) => {
							drawer.hidden = true;
						} );
						container.setAttribute( 'aria-hidden', 'true' );
						document.body.style.overflow = '';
						triggers.forEach( ( t ) =>
							t.setAttribute( 'aria-expanded', 'false' )
						);
					};

					const openDrawer = ( drawerId, triggerBtn ) => {
						const drawer = document.getElementById( drawerId );
						if ( ! drawer ) {
							return;
						}

						closeAll();

						drawer.hidden = false;
						container.setAttribute( 'aria-hidden', 'false' );
						document.body.style.overflow = 'hidden'; // lock scroll
						if ( triggerBtn ) {
							triggerBtn.setAttribute( 'aria-expanded', 'true' );
						}

						// Focus management
						const closeBtn =
							drawer.querySelector( '.cs-bio-close' );
						if ( closeBtn ) {
							setTimeout( () => closeBtn.focus(), 50 );
						}
					};

					triggers.forEach( ( trigger ) => {
						trigger.addEventListener( 'click', ( e ) => {
							e.preventDefault();
							const targetId =
								trigger.getAttribute( 'aria-controls' );
							openDrawer( targetId, trigger );
						} );
					} );

					drawers.forEach( ( drawer ) => {
						const closeBtn =
							drawer.querySelector( '.cs-bio-close' );
						if ( closeBtn ) {
							closeBtn.addEventListener( 'click', closeAll );
						}
					} );

					backdrop.addEventListener( 'click', closeAll );

					document.addEventListener( 'keydown', ( e ) => {
						if (
							e.key === 'Escape' &&
							container.getAttribute( 'aria-hidden' ) === 'false'
						) {
							// capture before closeAll resets aria-expanded
							const activeTrigger = triggers.find(
								( t ) =>
									t.getAttribute( 'aria-expanded' ) === 'true'
							);
							closeAll();
							if ( activeTrigger ) {
								activeTrigger.focus();
							}
						}
					} );

					// Start hidden so closed drawers stay out of the
					// accessibility tree and tab order until opened.
					closeAll();
				} );
		};

		// Hydrate the static pitch-night spotlight countdown from the
		// human-readable event date rendered in its DATE / TIME field.
		const initSpotlightCountdowns = () => {
			document
				.querySelectorAll( '.pitch-spotlight-card' )
				.forEach( ( card ) => {
					const units = card.querySelectorAll(
						'.countdown-time-unit strong'
					);
					const dateEl = card.querySelector( '.detail-row-val-text' );
					if ( units.length < 3 || ! dateEl ) {
						return;
					}

					const target = new Date(
						dateEl.textContent.trim() + ' 18:00:00'
					);
					if ( isNaN( target.getTime() ) ) {
						return;
					}

					const pad = ( n ) => String( n ).padStart( 2, '0' );
					const update = () => {
						const ms = Math.max( 0, target.getTime() - Date.now() );
						const mins = Math.floor( ms / 60000 );
						units[ 0 ].textContent = pad(
							Math.floor( mins / 1440 )
						);
						units[ 1 ].textContent = pad(
							Math.floor( ( mins % 1440 ) / 60 )
						);
						units[ 2 ].textContent = pad( mins % 60 );
					};

					update();
					setInterval( update, 30000 );
				} );
		};

		initBioDrawers();
		initSpotlightCountdowns();
		initVideoScrollHero();
		initFounderCarousels();
		initPitchCalculators();
		initDiligenceTimelines();
		initResourceTabs();
	} );
} )();
