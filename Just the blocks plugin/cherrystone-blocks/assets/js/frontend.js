/* global requestAnimationFrame, IntersectionObserver, Image, cancelAnimationFrame */
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
				const roleSelect = directory.querySelector(
					'[data-member-directory-role]'
				);
				const sortSelect = directory.querySelector(
					'[data-member-directory-sort]'
				);
				const grid = cards[ 0 ].parentElement;
				const total = cards.length;

				const sortKey = ( card, mode ) =>
					mode === 'last-asc'
						? card.dataset.last || ''
						: card.dataset.name || '';

				const update = () => {
					const query = search.value.trim().toLowerCase();
					const role = roleSelect ? roleSelect.value : '';
					let visible = 0;

					cards.forEach( ( card ) => {
						const text = card.dataset.search || '';
						const isMatch =
							( ! query || text.includes( query ) ) &&
							( ! role || ( card.dataset.role || '' ) === role );
						card.classList.toggle( 'is-hidden', ! isMatch );
						if ( isMatch ) {
							visible += 1;
						}
					} );

					if ( sortSelect ) {
						const mode = sortSelect.value;
						const sorted = cards
							.slice()
							.sort( ( a, b ) =>
								sortKey( a, mode ).localeCompare(
									sortKey( b, mode )
								)
							);
						if ( mode === 'first-desc' ) {
							sorted.reverse();
						}
						sorted.forEach( ( card ) => grid.appendChild( card ) );
					}

					count.textContent = `Showing ${ visible } of ${ total }`;
					if ( empty ) {
						empty.hidden = visible > 0;
					}
				};

				search.addEventListener( 'input', update );
				if ( roleSelect ) {
					roleSelect.addEventListener( 'change', update );
				}
				if ( sortSelect ) {
					sortSelect.addEventListener( 'change', update );
				}
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

					if ( slides.length < 2 ) {
						return;
					}

					const dots = Array.from(
						carousel.querySelectorAll( '.carousel-dot-indicator' )
					);

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
					const steps = Array.from(
						section.querySelectorAll( '.timeline-step' )
					);
					if ( ! steps.length ) {
						return;
					}

					const trackProgress = section.querySelector(
						'.timeline-track-progress'
					);

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

					// Optional collapse: server marks the grid with
					// data-collapse-after; cards beyond the limit are hidden
					// behind a "view all" control (all cards stay in the DOM
					// for SEO / no-JS visitors).
					const grid = section
						? section.querySelector( '[data-collapse-after]' )
						: null;
					const collapseLimit = grid
						? parseInt(
								grid.getAttribute( 'data-collapse-after' ),
								10
						  ) || 0
						: 0;
					let collapseExpanded = false;
					let showMoreBtn = null;

					const matchingCards = ( filter ) =>
						Array.prototype.filter.call(
							cards,
							( card ) =>
								filter === 'all' ||
								card.getAttribute( 'data-tag' ) === filter
						);

					const applyCollapse = ( filter ) => {
						if ( ! collapseLimit ) {
							return;
						}
						const matching = matchingCards( filter );
						cards.forEach( ( card ) =>
							card.classList.remove( 'is-collapse-hidden' )
						);
						if ( ! collapseExpanded ) {
							matching
								.slice( collapseLimit )
								.forEach( ( card ) =>
									card.classList.add( 'is-collapse-hidden' )
								);
						}
						if ( showMoreBtn ) {
							const overflow = matching.length - collapseLimit;
							const show = ! collapseExpanded && overflow > 0;
							showMoreBtn.parentNode.hidden = ! show;
							if ( show ) {
								showMoreBtn.textContent = `View all ${ matching.length } resources`;
							}
						}
					};

					const activeFilter = () => {
						const active =
							tabContainer.querySelector( '.chip.active' );
						return active
							? active.getAttribute( 'data-filter' )
							: 'all';
					};

					if ( collapseLimit && cards.length > collapseLimit ) {
						const wrap = document.createElement( 'div' );
						wrap.className = 'comms-show-more';
						showMoreBtn = document.createElement( 'button' );
						showMoreBtn.type = 'button';
						showMoreBtn.className = 'btn btn-ghost';
						wrap.appendChild( showMoreBtn );
						grid.parentNode.insertBefore( wrap, grid.nextSibling );
						showMoreBtn.addEventListener( 'click', () => {
							collapseExpanded = true;
							applyCollapse( activeFilter() );
						} );
						applyCollapse( 'all' );
					}

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
							collapseExpanded = false;
							applyCollapse( filter );
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

		// ── Communications page: filterable updates feed ─────────────────────
		const initCommsFeed = () => {
			document
				.querySelectorAll( '[data-comms-feed]' )
				.forEach( ( feed ) => {
					const rows = Array.prototype.slice.call(
						feed.querySelectorAll( '.news-row' )
					);
					if ( ! rows.length ) {
						return;
					}
					const limit =
						parseInt(
							feed.getAttribute( 'data-visible-rows' ),
							10
						) || 8;
					const section = feed.closest( 'section' );
					const chips = section
						? section.querySelectorAll( '.comms-feed-tabs .chip' )
						: [];
					let filter = 'all';
					let expanded = false;

					const wrap = document.createElement( 'div' );
					wrap.className = 'comms-show-more';
					const moreBtn = document.createElement( 'button' );
					moreBtn.type = 'button';
					moreBtn.className = 'btn btn-ghost';
					wrap.appendChild( moreBtn );
					feed.parentNode.insertBefore( wrap, feed.nextSibling );

					const render = () => {
						const matching = rows.filter(
							( row ) =>
								filter === 'all' ||
								row.getAttribute( 'data-cat' ) === filter
						);
						rows.forEach( ( row ) =>
							row.classList.add( 'is-filter-hidden' )
						);
						( expanded
							? matching
							: matching.slice( 0, limit )
						).forEach( ( row ) =>
							row.classList.remove( 'is-filter-hidden' )
						);
						const overflow = matching.length - limit;
						wrap.hidden = expanded || overflow <= 0;
						if ( ! wrap.hidden ) {
							moreBtn.textContent = `Show all ${ matching.length } updates`;
						}
					};

					moreBtn.addEventListener( 'click', () => {
						expanded = true;
						render();
					} );

					chips.forEach( ( chip ) => {
						chip.addEventListener( 'click', () => {
							chips.forEach( ( c ) =>
								c.classList.remove( 'active' )
							);
							chip.classList.add( 'active' );
							filter = chip.getAttribute( 'data-filter' );
							expanded = false;
							render();
						} );
					} );

					render();
				} );
		};

		// ── Communications page: digest signup (mailto-backed, like the other
		// site forms — no fake backend, the visitor's mail client sends it). ──
		const initCommsDigest = () => {
			document
				.querySelectorAll( '[data-comms-digest]' )
				.forEach( ( form ) => {
					const input = form.querySelector( 'input[type="email"]' );
					const note = form.parentNode.querySelector(
						'[data-comms-digest-note]'
					);
					const recipient =
						form.getAttribute( 'data-recipient' ) ||
						'info@cherrystoneangelgroup.com';
					form.addEventListener( 'submit', ( event ) => {
						event.preventDefault();
						const email = input ? input.value.trim() : '';
						if (
							! email ||
							! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email )
						) {
							if ( input ) {
								input.focus();
								input.setAttribute( 'aria-invalid', 'true' );
							}
							if ( note ) {
								note.textContent =
									'Please enter a valid email address.';
								note.classList.add( 'is-error' );
							}
							return;
						}
						if ( input ) {
							input.removeAttribute( 'aria-invalid' );
						}
						const subject = encodeURIComponent(
							'Cherrystone digest subscription'
						);
						const body = encodeURIComponent(
							`Please add me to the Cherrystone digest.\n\nEmail: ${ email }`
						);
						window.location.href = `mailto:${ recipient }?subject=${ subject }&body=${ body }`;
						if ( note ) {
							note.textContent =
								'Thanks — your mail client should be open. Send the note and you’re on the list.';
							note.classList.remove( 'is-error' );
							note.classList.add( 'is-success' );
						}
					} );
				} );
		};

		const initVideoScrollHero = () => {
			const hero = document.querySelector( '.sequence-hero-container' );
			if ( ! hero ) {
				return;
			}

			const preloader = document.querySelector( '.preloader-overlay' );

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
				const bar = document.querySelector( '.preloader-bar' );
				const pctEl = document.querySelector( '.preloader-percentage' );

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

				// Mobile prefers-reduced-motion optimized loading
				if ( reducedMotion ) {
					const img = new Image();
					img.decoding = 'async';
					img.src = frameUrl( frameStart );
					img.onload = () => {
						firstDrawable = img;
						frames[ 0 ] = img;
						resize();
						drawFrame( img );
						hidePreloader();
					};
					img.onerror = () => {
						hidePreloader();
					};
					window.addEventListener( 'resize', resize, {
						passive: true,
					} );
					return;
				}

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
				const bar = document.querySelector( '.preloader-bar' );
				const pctEl = document.querySelector( '.preloader-percentage' );
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

		const initPortfolioOrchards = () => {
			document
				.querySelectorAll( '.cherrystone-page-portfolio-template' )
				.forEach( ( page ) => {
					const heroGraphic =
						page.querySelector( '.page-hero-graphic' );
					const grid = page.querySelector( '#portfolio-grid' );

					if (
						! heroGraphic ||
						! grid ||
						heroGraphic.querySelector( '.portfolio-orchard' )
					) {
						return;
					}

					const cards = Array.from(
						grid.querySelectorAll( '.portfolio-card' )
					);
					if ( ! cards.length ) {
						return;
					}

					const sectors = [
						'Life Sciences',
						'Software',
						'Healthcare',
						'Industrial Tech',
						'Consumer',
						'Fintech',
					];
					const sectorAlias = {
						FinTech: 'Fintech',
						Industrial: 'Industrial Tech',
					};
					const reducedMotion =
						window.matchMedia &&
						window.matchMedia( '(prefers-reduced-motion: reduce)' )
							.matches;

					const orchard = document.createElement( 'div' );
					orchard.className = 'portfolio-orchard';
					orchard.setAttribute(
						'aria-label',
						'Portfolio company cluster grouped by sector'
					);

					const linkSvg = document.createElementNS(
						'http://www.w3.org/2000/svg',
						'svg'
					);
					linkSvg.setAttribute( 'class', 'portfolio-orchard__links' );
					linkSvg.setAttribute( 'aria-hidden', 'true' );
					orchard.appendChild( linkSvg );

					const hubLayer = document.createElement( 'div' );
					hubLayer.className = 'portfolio-orchard__hubs';
					orchard.appendChild( hubLayer );

					const nodeLayer = document.createElement( 'div' );
					nodeLayer.className = 'portfolio-orchard__nodes';
					orchard.appendChild( nodeLayer );

					const caption = document.createElement( 'div' );
					caption.className = 'portfolio-orchard__caption';
					caption.innerHTML =
						'<strong>Active</strong><span>All Verticals</span>';
					orchard.appendChild( caption );

					heroGraphic.appendChild( orchard );

					const normalizeSector = ( value ) =>
						sectorAlias[ value ] || value || 'Other';

					const hubPositions = sectors.reduce(
						( acc, sector, index ) => {
							const angle =
								( index / sectors.length ) * Math.PI * 2 -
								Math.PI / 2;
							acc[ sector ] = {
								x: 50 + Math.cos( angle ) * 27,
								y: 50 + Math.sin( angle ) * 25,
							};
							return acc;
						},
						{}
					);
					hubPositions.Other = { x: 50, y: 50 };

					const hubs = Object.entries( hubPositions ).map(
						( [ sector, point ] ) => {
							const hub = document.createElement( 'span' );
							hub.className = 'portfolio-orchard__hub';
							hub.textContent = sector.replace(
								'Industrial Tech',
								'Industrial'
							);
							hub.style.left = `${ point.x }%`;
							hub.style.top = `${ point.y }%`;
							hubLayer.appendChild( hub );
							return hub;
						}
					);

					const items = cards.map( ( card, index ) => {
						const logo = card.querySelector( '.logo img' );
						const fallback =
							card.querySelector( '.logo .fallback' );
						const title = card.querySelector( 'h3' );
						const sector = normalizeSector( card.dataset.sector );
						const hub =
							hubPositions[ sector ] || hubPositions.Other;
						const angle = ( index / cards.length ) * Math.PI * 2;

						const node = document.createElement( 'a' );
						node.className = 'portfolio-orchard__node';
						node.href = card.href;
						if ( card.target ) {
							node.target = card.target;
							node.rel = card.rel || 'noopener noreferrer';
						}
						node.setAttribute(
							'aria-label',
							title
								? title.textContent.trim()
								: 'Portfolio company'
						);

						if ( logo ) {
							const img = document.createElement( 'img' );
							img.src = logo.currentSrc || logo.src;
							img.alt = '';
							img.decoding = 'async';
							img.loading = 'lazy';
							img.addEventListener( 'error', () => {
								img.style.display = 'none';
								const fb = node.querySelector(
									'.portfolio-orchard__fallback'
								);
								if ( fb ) {
									fb.style.display = 'flex';
								}
							} );
							node.appendChild( img );
						}

						const fb = document.createElement( 'span' );
						fb.className = 'portfolio-orchard__fallback';
						fb.textContent =
							( fallback && fallback.textContent.trim() ) ||
							( title
								? title.textContent.trim().slice( 0, 2 )
								: 'CS' );
						node.appendChild( fb );

						nodeLayer.appendChild( node );

						return {
							card,
							node,
							sector,
							status: card.dataset.status || 'Active',
							x: hub.x + Math.cos( angle ) * 18,
							y: hub.y + Math.sin( angle ) * 16,
							vx: 0,
							vy: 0,
							tx: hub.x,
							ty: hub.y,
						};
					} );

					const lines = items.map( () => {
						const line = document.createElementNS(
							'http://www.w3.org/2000/svg',
							'line'
						);
						line.setAttribute( 'class', 'portfolio-orchard__link' );
						linkSvg.appendChild( line );
						return line;
					} );

					let currentStatus = 'Active';
					let currentSector = 'All';
					let frame = null;

					const getActiveFilter = ( type, fallbackValue ) => {
						const active = page.querySelector(
							`.filter-btn.active[data-filter-type="${ type }"]`
						);
						return active
							? active.getAttribute( 'data-filter-val' )
							: fallbackValue;
					};

					const retarget = () => {
						currentStatus = getActiveFilter(
							'status',
							currentStatus
						);
						currentSector = getActiveFilter(
							'sector',
							currentSector
						);

						const visibleItems = items.filter(
							( item ) =>
								( currentStatus === 'All' ||
									item.status === currentStatus ) &&
								( currentSector === 'All' ||
									item.sector === currentSector )
						);
						const hub =
							currentSector === 'All'
								? null
								: hubPositions[
										normalizeSector( currentSector )
								  ] || hubPositions.Other;

						items.forEach( ( item, index ) => {
							const visible = visibleItems.indexOf( item ) !== -1;
							const position = visibleItems.indexOf( item );
							const baseHub =
								hub ||
								hubPositions[ item.sector ] ||
								hubPositions.Other;
							const ring = currentSector === 'All' ? 17 : 25;
							const angle =
								( ( position >= 0 ? position : index ) /
									Math.max( visibleItems.length, 1 ) ) *
								Math.PI *
								2;

							item.tx =
								baseHub.x +
								Math.cos( angle ) *
									ring *
									( 0.72 + ( index % 3 ) * 0.16 );
							item.ty =
								baseHub.y +
								Math.sin( angle ) *
									ring *
									( 0.7 + ( index % 4 ) * 0.1 );
							item.node.classList.toggle( 'is-muted', ! visible );
						} );

						const label = caption.querySelector( 'strong' );
						const sub = caption.querySelector( 'span' );
						if ( label ) {
							label.textContent =
								currentStatus === 'Exit' ? 'Exits' : 'Active';
						}
						if ( sub ) {
							sub.textContent =
								currentSector === 'All'
									? 'All Verticals'
									: currentSector;
						}

						if ( reducedMotion ) {
							items.forEach( ( item ) => {
								item.x = item.tx;
								item.y = item.ty;
							} );
							draw();
						} else {
							start();
						}
					};

					const draw = () => {
						const activeItems = items.filter(
							( item ) =>
								! item.node.classList.contains( 'is-muted' )
						);

						items.forEach( ( item, index ) => {
							item.node.style.setProperty(
								'--x',
								`${ item.x }%`
							);
							item.node.style.setProperty(
								'--y',
								`${ item.y }%`
							);
							const line = lines[ index ];
							const showLine = activeItems.indexOf( item ) !== -1;
							const hub =
								currentSector === 'All'
									? hubPositions[ item.sector ] ||
									  hubPositions.Other
									: hubPositions[
											normalizeSector( currentSector )
									  ] || hubPositions.Other;
							line.style.opacity = showLine ? '1' : '0';
							line.setAttribute( 'x1', `${ hub.x }%` );
							line.setAttribute( 'y1', `${ hub.y }%` );
							line.setAttribute( 'x2', `${ item.x }%` );
							line.setAttribute( 'y2', `${ item.y }%` );
						} );

						hubs.forEach( ( hub ) => {
							const text = hub.textContent || '';
							const sector =
								text === 'Industrial'
									? 'Industrial Tech'
									: text;
							const active =
								currentSector === 'All' ||
								normalizeSector( currentSector ) === sector;
							hub.style.opacity = active ? '1' : '0.26';
						} );
					};

					const tick = () => {
						let isMoving = false;

						items.forEach( ( item, index ) => {
							item.vx += ( item.tx - item.x ) * 0.018;
							item.vy += ( item.ty - item.y ) * 0.018;

							items.forEach( ( other, otherIndex ) => {
								if ( index === otherIndex ) {
									return;
								}
								const dx = item.x - other.x;
								const dy = item.y - other.y;
								const d2 = dx * dx + dy * dy || 0.01;
								if ( d2 < 115 ) {
									const force = 0.42 / d2;
									item.vx += dx * force;
									item.vy += dy * force;
								}
							} );

							item.vx *= 0.82;
							item.vy *= 0.82;
							item.x += item.vx;
							item.y += item.vy;
							item.x = Math.max( 8, Math.min( 92, item.x ) );
							item.y = Math.max( 9, Math.min( 91, item.y ) );

							if (
								Math.abs( item.vx ) > 0.01 ||
								Math.abs( item.vy ) > 0.01 ||
								Math.abs( item.tx - item.x ) > 0.08 ||
								Math.abs( item.ty - item.y ) > 0.08
							) {
								isMoving = true;
							}
						} );

						draw();
						frame = isMoving
							? window.requestAnimationFrame( tick )
							: null;
					};

					const start = () => {
						if ( ! frame ) {
							frame = window.requestAnimationFrame( tick );
						}
					};

					page.querySelectorAll( '.filter-btn' ).forEach(
						( button ) => {
							button.addEventListener( 'click', () => {
								window.requestAnimationFrame( retarget );
							} );
						}
					);

					retarget();
					draw();
					if ( ! reducedMotion ) {
						start();
					}

					window.addEventListener(
						'pagehide',
						() => {
							if ( frame ) {
								window.cancelAnimationFrame( frame );
							}
						},
						{ once: true }
					);
				} );
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

		// Rotate .about-statement phrases one at a time (sponsors / about
		// pages). No-JS and reduced-motion users keep the static stack.
		const initStatementRotators = () => {
			if (
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
			) {
				return;
			}

			document
				.querySelectorAll( '.about-statement' )
				.forEach( ( section ) => {
					const rotator = section.querySelector(
						'.about-statement-rotator'
					);
					const phrases = rotator
						? Array.from(
								rotator.querySelectorAll( '.asr-phrase' )
						  )
						: [];

					if ( phrases.length < 2 ) {
						return;
					}

					const pips = Array.from(
						section.querySelectorAll( '.about-statement-pips span' )
					);

					// Reserve room for the tallest phrase before phrases go absolute.
					const measure = () => {
						section.classList.remove( 'is-rotating' );
						rotator.style.minHeight = '';
						const tallest = Math.max(
							...phrases.map( ( p ) => p.offsetHeight )
						);
						rotator.style.minHeight = tallest + 'px';
						section.classList.add( 'is-rotating' );
					};

					let resizeTimer;
					window.addEventListener( 'resize', () => {
						clearTimeout( resizeTimer );
						resizeTimer = setTimeout( measure, 150 );
					} );
					measure();

					let index = 0;
					const show = ( next ) => {
						phrases.forEach( ( p, i ) => {
							p.classList.toggle( 'is-active', i === next );
							p.classList.toggle(
								'is-leaving',
								i === index && i !== next
							);
						} );
						pips.forEach( ( p, i ) =>
							p.classList.toggle( 'is-active', i === next )
						);
						index = next;
					};

					show( 0 );
					setInterval(
						() => show( ( index + 1 ) % phrases.length ),
						4500
					);
				} );
		};

		// Click/tap toggles the bio overlay on member, leadership, and
		// sponsor cards (hover/focus reveal still works where defined).
		const initBioCardToggles = () => {
			const cards = Array.from(
				document.querySelectorAll( '.member-card, .sponsor-card' )
			).filter( ( card ) =>
				card.querySelector( '.member-bio, .sponsor-card-bio' )
			);

			if ( ! cards.length ) {
				return;
			}

			const syncToggle = ( card ) => {
				const toggle = card.querySelector( '.sponsor-bio-toggle' );
				if ( toggle ) {
					toggle.setAttribute(
						'aria-expanded',
						card.classList.contains( 'is-open' ) ? 'true' : 'false'
					);
				}
			};

			const closeAll = ( except ) => {
				cards.forEach( ( card ) => {
					if ( card !== except ) {
						card.classList.remove( 'is-open' );
						syncToggle( card );
					}
				} );
			};

			cards.forEach( ( card ) => {
				card.addEventListener( 'click', ( event ) => {
					// Links inside the card (LinkedIn, sponsor site) keep working.
					if ( event.target.closest( 'a' ) ) {
						return;
					}
					closeAll( card );
					card.classList.toggle( 'is-open' );
					syncToggle( card );
				} );

				card.addEventListener( 'keydown', ( event ) => {
					if (
						( event.key === 'Enter' || event.key === ' ' ) &&
						event.target === card
					) {
						event.preventDefault();
						card.click();
					}
				} );
			} );

			document.addEventListener( 'click', ( event ) => {
				if ( ! event.target.closest( '.member-card, .sponsor-card' ) ) {
					closeAll();
				}
			} );

			document.addEventListener( 'keydown', ( event ) => {
				if ( event.key === 'Escape' ) {
					closeAll();
				}
			} );
		};

		const initAccessibilityFixes = () => {
			const honeypots = document.querySelectorAll( '.wpforms-field-hp' );
			honeypots.forEach( ( hp ) => {
				hp.setAttribute( 'aria-hidden', 'true' );
				hp.setAttribute( 'tabindex', '-1' );
				hp.style.display = 'none';
			} );
		};

		const initMotionImprovements = () => {
			const prefersReducedMotion =
				window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			if ( prefersReducedMotion ) {
				return;
			}

			// 1. Slider values scroll animation
			const initSliderAnimations = () => {
				const sliders = document.querySelectorAll(
					'#calc-amt-slider, .calc-range-slider'
				);
				sliders.forEach( ( slider ) => {
					const minVal = Number( slider.min ) || 100000;
					const targetVal = Number( slider.value ) || 500000;

					let animationFrameId = null;
					let isProgrammatic = false;

					const animateSlider = ( start, end ) => {
						const duration = 800; // ms
						let startTime = null;

						const step = ( timestamp ) => {
							if ( ! startTime ) {
								startTime = timestamp;
							}
							const elapsed = timestamp - startTime;
							const progress = Math.min( elapsed / duration, 1 );

							// cubic-bezier(0.16, 1, 0.3, 1) approximation (easeOutQuart)
							const ease = 1 - Math.pow( 1 - progress, 4 );

							slider.value = Math.round(
								start + ( end - start ) * ease
							);
							try {
								isProgrammatic = true;
								slider.dispatchEvent( new Event( 'input' ) );
							} finally {
								isProgrammatic = false;
							}

							if ( progress < 1 ) {
								animationFrameId =
									requestAnimationFrame( step );
							} else {
								animationFrameId = null;
							}
						};
						animationFrameId = requestAnimationFrame( step );
						return animationFrameId;
					};

					const cancelAnimation = () => {
						if ( ! isProgrammatic && animationFrameId ) {
							cancelAnimationFrame( animationFrameId );
							animationFrameId = null;
						}
					};

					slider.addEventListener( 'mousedown', cancelAnimation );
					slider.addEventListener( 'touchstart', cancelAnimation );
					slider.addEventListener( 'input', cancelAnimation );

					const observer = new IntersectionObserver(
						( entries ) => {
							entries.forEach( ( entry ) => {
								if ( entry.isIntersecting ) {
									slider.value = minVal;
									try {
										isProgrammatic = true;
										slider.dispatchEvent(
											new Event( 'input' )
										);
									} finally {
										isProgrammatic = false;
									}
									animationFrameId = animateSlider(
										minVal,
										targetVal
									);
									observer.unobserve( slider );
								}
							} );
						},
						{ threshold: 0.15 }
					);
					observer.observe( slider );
				} );
			};

			// 2. Stat numbers count-up animation
			const initStatAnimations = () => {
				const statElements = document.querySelectorAll(
					'.stats .stat .num span.accent, ' +
						'.stats-dashboard-card .stats-number-display strong.stats-number-value'
				);

				const animateStatNumber = ( element ) => {
					const originalText = element.textContent.trim();
					const cleanStr = originalText.replace( /,/g, '' );
					const regex = /^([^0-9\.\-]*)([0-9\.\-]+)(.*)$/;
					const match = cleanStr.match( regex );

					if ( ! match ) {
						return;
					}

					const prefix = match[ 1 ];
					const targetNum = parseFloat( match[ 2 ] );
					const suffix = match[ 3 ];
					const decimals = match[ 2 ].includes( '.' )
						? match[ 2 ].split( '.' )[ 1 ].length
						: 0;
					const hasCommas = originalText.includes( ',' );

					const duration = 400; // ms
					let startTime = null;

					const formatVal = ( val ) => {
						let valStr = val.toFixed( decimals );
						if ( hasCommas ) {
							const parts = valStr.split( '.' );
							parts[ 0 ] = parts[ 0 ].replace(
								/\B(?=(\d{3})+(?!\d))/g,
								','
							);
							valStr = parts.join( '.' );
						}
						return prefix + valStr + suffix;
					};

					element.textContent = formatVal( 0 );

					const step = ( timestamp ) => {
						if ( ! startTime ) {
							startTime = timestamp;
						}
						const elapsed = timestamp - startTime;
						const progress = Math.min( elapsed / duration, 1 );

						// spring deceleration approximation (easeOutQuart)
						const ease = 1 - Math.pow( 1 - progress, 4 );
						const currentNum = targetNum * ease;

						element.textContent = formatVal( currentNum );

						if ( progress < 1 ) {
							requestAnimationFrame( step );
						} else {
							element.textContent = originalText;
						}
					};
					requestAnimationFrame( step );
				};

				statElements.forEach( ( element ) => {
					const observer = new IntersectionObserver(
						( entries ) => {
							entries.forEach( ( entry ) => {
								if ( entry.isIntersecting ) {
									animateStatNumber( element );
									observer.unobserve( element );
								}
							} );
						},
						{ threshold: 0.1 }
					);
					observer.observe( element );
				} );
			};

			// 3. Dynamic tilt / parallax for portfolio cards
			const initPortfolioCardParallax = () => {
				const cards = document.querySelectorAll( '.portfolio-card' );
				cards.forEach( ( card ) => {
					const logo = card.querySelector( '.logo' );
					if ( ! logo ) {
						return;
					}

					let rAFId = null;
					let rect = null;

					card.addEventListener( 'mouseenter', () => {
						rect = card.getBoundingClientRect();
					} );

					card.addEventListener( 'mousemove', ( e ) => {
						if ( ! rect ) {
							rect = card.getBoundingClientRect();
						}
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;

						const px = ( x / rect.width ) * 2 - 1;
						const py = ( y / rect.height ) * 2 - 1;

						if ( rAFId ) {
							cancelAnimationFrame( rAFId );
						}

						rAFId = requestAnimationFrame( () => {
							logo.style.transform =
								'translate3d(' +
								( px * 8 ).toFixed( 3 ) +
								'px, ' +
								( py * 8 ).toFixed( 3 ) +
								'px, 0)';
						} );
					} );

					card.addEventListener( 'mouseleave', () => {
						if ( rAFId ) {
							cancelAnimationFrame( rAFId );
							rAFId = null;
						}
						rect = null;
						logo.style.transform = '';
					} );
				} );
			};

			initSliderAnimations();
			initStatAnimations();
			initPortfolioCardParallax();
		};

		initBioDrawers();
		initSpotlightCountdowns();
		initStatementRotators();
		initBioCardToggles();
		initPortfolioOrchards();
		initVideoScrollHero();
		initFounderCarousels();
		initPitchCalculators();
		initDiligenceTimelines();
		initResourceTabs();
		initCommsFeed();
		initCommsDigest();
		initAccessibilityFixes();
		initMotionImprovements();
	} );
} )();
