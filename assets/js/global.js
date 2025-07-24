document.addEventListener('DOMContentLoaded', function(){

	//Consts
	const b = $('body'),
			w = $('#wrapper'),
			nav = $('#nav-bar'),
			scrollBar = $('#scroll-bar-wrapper'),
			scrollTop = $('#scroll-top'),
			isTouchDevice = () => {
				return (('ontouchstart' in window) ||
						  (navigator.maxTouchPoints > 0) ||
						  (navigator.msMaxTouchPoints > 0));
			};

	//Speed
	const speed = 750,
			speedx2 = 1500,
			speed_2 = 300,
			ease = $.bez([0.615, 0.010, 0.555, 1.000]);

	//Functions
	function height(){
		document.documentElement.style.cssText = `
			--h:  ${window.innerHeight}px;
			--hs: ${window.innerHeight - $('header').outerHeight(true)}px;
		`;
	}
	function init(){
		w.removeClass('transition');
		$('main').fadeIn(speed_2, function(){
			lastProject();
		}).addClass('completed');
		if(w.hasClass('page-archive')){
			$('.project:visible').each(function(index){
				var t = $(this);
				setTimeout(function(){
					t.addClass('completed');
				}, 50*index);
			});
		}
	}
	function lastProject(){
		if(w.hasClass('page-news')){
			$('.page-news .project .thumbnail').each(function(){
				var t = $(this),
					 n = t.next(),
					 p = $('#modules'),
					 tmath = (t.offset().top - p.offset().top) + t.outerHeight(true) + n.outerHeight(true);
				if(tmath > p.outerHeight(true) && !t.parent().is(':last-child')){
					t.parent().addClass('last')
				}else{
					t.parent().removeClass('last')
				}
			});
		}
	}
	function showCollapsed(t, n){
		if($('.collapsed').not(n).is(':visible')){
			$('.trigger').removeClass('trigger-active');
			t.addClass('trigger-active');
			$('.collapsed').stop();
			$('.collapsed:visible').not(n).fadeOut(speed_2, function(){
				showCollapsedItems(n);
			});
		}else{
			$('.collapsed').stop();
			if(!n.is(':visible')){
				t.addClass('trigger-active');
				showCollapsedItems(n);
			}else{
				t.removeClass('trigger-active');
				n.stop().fadeOut(speed_2);
			}
		}
	}
	function showCollapsedItems(n){
		n.find('.collapsed-item').removeClass('visible');
		n.stop()
		 .removeAttr('style')
		 .show()
		 .animate({
			'opacity' : 1,
			'margin' : 0
		}, speed_2, ease).find('.collapsed-item').addClass('visible');
	}
	function hideCollapsed(){
		if($('.collapsed').is(':visible')){
			$('.trigger').removeClass('trigger-active');
			$('.collapsed').stop().fadeOut(speed_2);
			$('.blur').removeClass('blur');
		}
	}
	var M = $('.marquee');
	function marquee(){
		if(M.length){
			var w = M.width() - 60,
				 m = M.find('wrap').width(),
				 p = m / 25;
			M.css('animation-duration', p + 's')
			if(m > w){
				if(!M.hasClass('active')){
					M.addClass('active').find('wrap').clone().addClass('clone').insertAfter(M.find('wrap'))
				}
			}else{
				M.removeClass('active').find('.clone').remove()
			}
		}
	}
	function onLoadandResize(){
		height()
		lastProject()
	}
	onLoadandResize();

	//Device detection
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent || navigator.vendor || window.opera) || isTouchDevice() == true){
		//If device
		b.addClass('mobile');

		//Pseudoclass :active on devices
		document.addEventListener('touchstart', function(){}, {passive: true});

		//Resize Functions
		window.addEventListener('orientationchange', function(){
			setTimeout(function(){
				onLoadandResize();
				marquee();
			}, 50);
		});

		//Open/Hide Collapsed
		$('.trigger').click(function(){
			var t = $(this),
				 n = t.next('.collapsed');

			showCollapsed(t, n);

			if($('.trigger.trigger-active').length){
				t.parents('.collapsed-content-wrapper').next().addClass('blur');
			}else{
				t.parents('.collapsed-content-wrapper').next().removeClass('blur');
			}
		});

		//Click functions
		w.click(function(){
			hideCollapsed();
		});
		$('#filters, .module-type-alts').click(function(e){
			e.stopPropagation();
		});

	}else{
		//If Desktop
		b.addClass('desktop');

		//Resize Functions
		window.onresize = function(){
			onLoadandResize();
			marquee();
		}

		//Open/Hide Collapsed
		$('.trigger').mouseenter(function(){
			var t = $(this).parent(),
				 n = t.find('.collapsed');
			if(!t.hasClass('trigger-active')){
				showCollapsed(t, n);
			}
			t.parents('.collapsed-content-wrapper').next().addClass('blur');
		});
		$('.collapsed-content-wrapper > wrap').mouseleave(function(){
			$('.trigger-active').removeClass('trigger-active');
			$('.collapsed').stop().fadeOut(speed_2);
			$('.collapsed-item').removeClass('visible');
			$('.blur').removeClass('blur');
		});
		$('#archive .project').mouseenter(function(){
			$('#archive .project').not($(this)).addClass('blur');
		}).mouseleave(function(){
			$('#archive .project').removeClass('blur');
		});

		//Scroll Bar
		scrollBar.mouseenter(function(){
			scrollBar.children().show()
		}).mouseleave(function(){
			scrollBar.children().fadeOut(speed_2)
		});
	}

	//Loader/Intro
	const l = $('#loader');
	if(l.length){
		if(w.hasClass('page-news') && sessionStorage.getItem('intro') != 'false'){
			$('header, #scroll-bar-wrapper, footer').hide();
			nav.addClass('intro');
			setTimeout(function(){
				nav.removeClass('intro').addClass('completed');
				l.fadeOut(speedx2, function(){
					sessionStorage.setItem('intro', false);
					$('header, #scroll-bar-wrapper, footer').fadeIn(speed_2);
					setTimeout(function(){
						nav.removeClass('completed');
						l.remove();
						init();
					}, speed_2);
				});
			}, speed);
		}else{
			setTimeout(function(){
				l.fadeOut(speed_2, function(){
					l.remove();
					init();
				});
			}, speed_2);
		}
	}else{
		setTimeout(function(){
			init();
		}, speed_2);
	}

	//Dark Mode
	if(sessionStorage.getItem('dark-mode') === 'true'){
		$('html').addClass('dark-mode');
	}
	$('#dark-mode').click(function(){
		if($('html').hasClass('dark-mode')){
			$('html').removeClass('dark-mode');
			sessionStorage.setItem('dark-mode', 'false');
		}else{
			$('html').addClass('dark-mode');
			sessionStorage.setItem('dark-mode', 'true');
		}
	});

	//Pop-ups
	var timer = null;
	$('.banner').each(function(){
		var t = $(this),
			 other = $('.banner').not(t),
			 delay = t.data('time');
		if(sessionStorage.getItem(t.attr('id')) == 'true'){
			t.remove();
		}
		if(t.length && sessionStorage.getItem(t.attr('id')) != 'true'){
			if(t.hasClass('landing')){
				if(other.length && !other.is(':visible') && delay < other.data('time') || !other.length){
					if(delay == 0 && w.hasClass('page-news') && sessionStorage.getItem('intro') != 'false'){
						nav.removeClass('banner-active-intro banner-active banner-close').addClass('banner-active-intro');
						t.fadeIn(speed + speedx2, function(){
							t.addClass('completed');
							if(!t.is('#newsletter')){
								marquee();
							}
						});
					}else{
						if(w.hasClass('page-news') && sessionStorage.getItem('intro') != 'false'){
							delay = delay + speed + speedx2;
						}else{
							delay = delay + speed_2;
						}
						timer = setTimeout(function(){
							nav.removeClass('banner-active banner-close').addClass('banner-active');
							t.fadeIn(speed_2, function(){
								t.addClass('completed');
								if(!t.is('#newsletter')){
									marquee();
								}
							});
						}, delay);
					}
				}
			}else{
				w.scroll(function(){
					var math = 100 * w.scrollTop() / (w.prop('scrollHeight') - $(window).height());
					if(!other.is(':visible') && math >= t.data('scroll') || !other.length && math >= t.data('scroll')){
						if(t.is('#newsletter') && $('#newsletter').length || t.is('#pop-up') && $('#pop-up').length){
							nav.removeClass('banner-active banner-close').addClass('banner-active');
						}
						t.fadeIn(speed_2, function(){
							t.addClass('completed');
							marquee();
						});
						if(timer){
							clearTimeout(timer);
							timer = null;
						}
					}
				});
			}
		}

		t.find('.close-banner').click(function(){
			var p = $(this).closest('.banner'),
				 other = $('.banner').not(p);

			t.removeClass('completed').fadeOut(speed_2, function(){
				t.remove();
				sessionStorage.setItem(p.attr('id'), true);
			});
			nav.removeClass('banner-active').addClass('banner-close');

			if(other.length && other.hasClass('landing') && sessionStorage.getItem(other.attr('id')) != 'true'){
				setTimeout(function(){
					nav.removeClass('banner-active banner-close').addClass('banner-active');
					other.fadeIn(speed_2, function(){
						other.addClass('completed');
						marquee();
					});
				}, other.data('time'));
			}
		});

	});

	//Newsletter
	const news = $('#newsletter');
	$('#newsletter input').keyup(function(){
		var t = $(this),
			 b = $('#newsletter button'),
			 c = $('#newsletter .close-banner');
		if(t.val().indexOf('@') > -1 == ''){
			b.hide();
			c.show();
		}else{
			b.show();
			c.hide();
		}
	}).click(function(){
		var t = $(this);
		if(t.val() == ''){
			t.attr('placeholder', '');
		}
	}).blur(function(){
		var t = $(this);
		if(t.val() == ''){
			t.attr('placeholder', t.data('placeholder'));
		}
	});
	news.submit(function(){
		var t = $(this);
		if(t.valid()){
			t.addClass('valid');
			setTimeout(function(){
				news.find('input').val(news.data('thanks')).blur().css('pointer-events', 'none');
			}, 1);
		}
	});
	window.addEventListener('focus', () => {
		if(news.hasClass('valid')){
			setTimeout(function(){
				news.removeClass('completed').fadeOut(speed_2, function(){
					news.remove();
					sessionStorage.setItem('newsletter', true);
				});
				nav.removeClass('banner-active').addClass('banner-close');
			}, speedx2);
		}
	});

	//Scroll Bar
	w.scroll(function(){
		var top = w.scrollTop(),
			 c = $('main').outerHeight(true),
			 math = 100 * top / (c - $(window).height());

		//Show/Hide scrollbar when scrolling
		scrollBar.children().show().val(math);
		clearTimeout($.data(this, 'scrollTimer'));
		$.data(this, 'scrollTimer', setTimeout(function(){
			scrollBar.children().fadeOut(speed_2)
		}, speedx2));

		//Show/hide Scrolltop
		if(top > 100){
			scrollTop.show()
		}else{
			scrollTop.fadeOut(speed_2)
		}

	});
	scrollBar.children().on('change input', function(){
		var c = $('header').outerHeight(true) + $('main').outerHeight(true),
			 math = (c - $(window).height()) * ($(this).val() / 100);
		w.scrollTop(math);
	});

	//Scroll Top
	w.scrollTop(0);
	scrollTop.click(function(){
		w.animate({
			scrollTop: '0'
		}, speed_2, ease);
	});

	//Related projects
	if(w.hasClass('page-news')){
		sessionStorage.setItem('Archive', false);
		sessionStorage.setItem('News', true);
	}else{
		if(w.hasClass('page-project')){
			if(sessionStorage.getItem('News') != 'true'){
				sessionStorage.setItem('Archive', true);
			}
		}else{
			sessionStorage.setItem('News', false);
			sessionStorage.setItem('Archive', true);
		}
	}
	if(sessionStorage.getItem('News') == 'true'){
		$('#related-archive').remove()
	}else if(sessionStorage.getItem('Archive') == 'true'){
		$('#related-news').remove()
	}

	//Menu/Animations
	$('[data-target]').click(function(){
		var t = $(this);
		$('header a.menu-item').removeClass('active');
		if(t.is('.menu-item')){
			t.addClass('active');
		}
		w.addClass('transition');
		$('main').fadeOut(speed_2, function(){
			$('header, #nav-bar').addClass(t.data('target'));
			if(w.hasClass('page-archive')){
				$('#filters').fadeOut(speed).addClass(t.data('target'));
			}
			if(t.data('target') == 'target-archive'){
				$('#filters').fadeIn(speed).addClass(t.data('target'));
			}
		});

		scrollBar.children().fadeOut(speed_2);
	});

	//Find projects before text modules
	$('.page-news .module-text').each(function(){
		$(this).prev('.col-mob-4, .col-mob-3, .col-mob-2').addClass('full')
				 .prev('.col-mob-2').addClass('full')
	});

	//Clear filters
	$('#clear-all').click(function(){
		w.scrollTop(0);
		$('.filter').each(function(){
			var t = $(this),
				 path = window.location.href,
				 push = '?'+t.data('type')+'=',
				 url = t.data('url');
			if(path.indexOf(push+url) > -1){
				window.history.pushState({}, 'Filters Active', path.replace(push+url, ''));
			}else{
				window.history.pushState({}, 'Filters Active', path.replace('&'+url, ''));
			}
		});
		$('.trigger-active').removeClass('trigger-active');
		$('.filter').removeClass('active');
		$('main').removeClass('blur');
		$('#archive-wrapper, #archive').removeClass();
		$('.project').removeClass('active-category active-tag blur').addClass('completed');
		$('.collapsed').stop().hide();
		$(this).hide();
	});

	//Filters
	function filterInnerAdditive(W,T,c){
		//Hide projects
		$('.project').addClass('active-'+T);
		//Filter
		$(W).toggleClass(c);
		var fa = $(W).attr('class'),
			 ca = fa.split(/\s+/);
		$.each(ca, function(index, value){
			$('.project' + value).removeClass('active-'+T);
		});
	}
	$('.filter').each(function(){
		var t = $(this),
			 k = t.data('type'),
			 T = t.data('filter'),
			 c = t.data('class'),
			 p = t.parent().prev(),
			 W = t.data('wrapper'),
			 url = t.data('url');

		t.click(function(){

			w.scrollTop(0);

			//Active/deactive filter
			t.toggleClass('active');

			//Active Clear
			if($('.filter.active').length){
				if(!$('#clear-all').is(':visible')){
					$('#clear-all').show();
				}
			}else{
				$('.project').removeClass('active-category active-tag blur').addClass('completed');
				$('#clear-all').fadeOut(speed_2);
			}

			//Filter
			filterInnerAdditive(W,T,c);

			//Push active filters to URL
			var path = window.location.href,
				 push = '?'+k+'=';

			if($('.filter[data-filter="'+T+'"].active').length == 0 && path.indexOf(push) > -1){
				//Last filter active
				window.history.pushState({}, 'Filters Active', path.replace(push+url, ''));
			}else{
				if(path.indexOf(url) == -1){
					if(path.indexOf(push) == -1){
						//First filter active
						window.history.pushState({}, 'Filters Active', path+push+url);
					}else{
						//First filter already active
						window.history.pushState({}, 'Filters Active', path+'&'+url);
					}
				}
				if(path.indexOf(url) > -1){
					if(path.indexOf(push+url+'&') > -1 ){
						//Remove First filter
						window.history.pushState({}, 'Filters Active', path.replace(url+'&', ''));
					}else{
						//Remove following filters
						window.history.pushState({}, 'Filters Active', path.replace('&'+url, ''));
					}
				}
			}

		});

		//Push Url to active filters on load
		var path = window.location.href
		if(path.indexOf(url) > -1){
			//Active filter
			t.addClass('active');
			//Show Clear
			$('#clear-all').show();
			//Filer
			filterInnerAdditive(W,T,c);
		}

	});

	//Sort
	function activeSort(t, k){
		//Active
		t.addClass('active');
		$('.sort').not(t).removeClass('active');
		//Sort
		$('.project:not([data-'+ k +'="null"])').sort(function(a, b){
			if(k == 'date'){
				return $(b).data(k) >= $(a).data(k) ? 1 : -1;
			}else{
				return $(b).data(k) < $(a).data(k) ? 1 : -1;
			}
		}).prependTo('#archive');
	}
	$('.sort').each(function(){
		var t = $(this),
			 k = t.data('sort');

		t.click(function(){

			w.scrollTop(0);

			if(!t.hasClass('active')){
				activeSort(t,k);
			}else{
				t.removeClass('active');
				$('.project[data-'+ k +']').sort(function(a, b){
					return $(b).data('pos') < $(a).data('pos') ? 1 : -1;
				}).prependTo('#archive');
			}

			var push = '?sort=',
				 current = push+k,
				 prev = push+$('.sort').not(t).data('sort'),
				 first = push;
			var path = window.location.href;
			if(path.indexOf(first) == -1){
				window.history.pushState({}, 'Filters Active', path+current);
			}else{
				if(path.indexOf(current) == -1){
					window.history.pushState({}, 'Filters Active', path.replace(prev, current));
				}else{
					window.history.pushState({}, 'Filters Active', path.replace(current, ''));
				}
			}

		});

		//Push Url to active filters on load
		if(window.location.href.indexOf(k) > -1){
			activeSort(t,k);
		}

	});

	//Type tester
	function setHandlers(t,v,min,max){
		if(t.hasClass('virgin')){
			if(window.innerWidth > 1180){
				v = t.data('desktop');
			}else{
				v = t.data('tablet');
			}
			var math = Math.round((v - min) / (max - min) * 100);
			t.val(v)
			 .next().css('left', math + '%')
			 .find('wrap').html(v);
		}
	}
	function typeColumns(n,v,cols2,cols4){
		if(v > cols2){
			n.removeClass('cols-2 cols-4');
		}
		if(v < cols2 + 1 && v > cols4){
			n.removeClass('cols-4').addClass('cols-2');
		}
		if(v < cols4 + 1){
			n.removeClass('cols-2').addClass('cols-4');
		}
	}
	$('.module-type-handler').each(function(){
		var t = $(this),
			 min = t.attr('min'),
			 max = t.attr('max'),
			 spacing_d = t.data('spacing_d'),
			 spacing_t = t.data('spacing_t'),
			 spacing_m = t.data('spacing_m'),
			 cols4 = t.data('cols4'),
			 cols2 = t.data('cols2'),
			 v,
			 n = t.parent().parent().next('.module-type-editable');

		setHandlers(t,v,min,max);

		t.on('change input', function(){

			hideCollapsed();

			var w = window.innerWidth,
				 v = t.val(),
				 math = Math.round((v - min) / (max - min) * 100),
				 cols = Math.round(max/v),
				 spacing;
			t.removeClass('virgin')
			 .next().css('left', math + '%')
			 .find('wrap').html(v);
			n.css('font-size', v + 'px');

			/*Spacing*/
			if(v > t.data('desktop')){
				var spacing = spacing_d;
			}else if(v <= t.data('desktop') && v > t.data('tablet')){
				if(t.data('desktop') > t.data('tablet')){
					percentage = Math.round((v - t.data('tablet')) / (t.data('desktop') - t.data('tablet')) * -100 + 100);
				}else{
					percentage = Math.round((v - t.data('tablet')) / (t.data('desktop') - t.data('tablet')) * 100)
				}
				spacing = Math.round( spacing_d + ((spacing_t - spacing_d)/(100/percentage)) );
			}else if(v <= t.data('tablet') && v > t.data('mobile')){
				if(t.data('tablet') > t.data('mobile')){
					percentage = Math.round((v - t.data('mobile')) / (t.data('tablet') - t.data('mobile')) * 100);
				}else{
					percentage = Math.round((v - t.data('mobile')) / (t.data('tablet') - t.data('mobile')) * -100 + 100);
				}
				spacing = Math.round( spacing_m + ((spacing_t - spacing_m)/(100/percentage)) );
			}else if(v <= t.data('mobile')){
				spacing = spacing_m;
			}
			console.log( spacing )

			n.get(0).style.setProperty('--spacing', spacing);

			n.get(0).style.setProperty('--cols', cols);
			if(cols <= 1 || v >= 160){
				n.css('white-space', 'nowrap');
			}else{
				n.css('white-space', 'initial')
			}

			typeColumns(n,v,cols2,cols4);

		});
	});

	//Set columns type tester
	$('.module-type-editable').each(function(){
		var n = $(this),
			 cols4 = n.data('cols4'),
			 cols2 = n.data('cols2'),
			 v = n.prev().find('input').val();

		typeColumns(n,v,cols2,cols4);

	});

	//TypeStyles function
	$('.module-type-style').click(function(){
		var t = $(this),
			 v = t.data('value'),
			 p = t.parents('.module-type-header').next().find('span');
		if(!t.hasClass('active')){
			$('.module-type-style').removeClass('active')
			t.addClass('active');
			p.removeClass().addClass(v)
		}
	});

	//OpenType function
	$('.module-type-glyph').click(function(){
		var t = $(this),
			 v = t.data('value'),
			 p = t.parents('.module-type-header').next(),
			 c = p.css('font-feature-settings'),
			 V = c.replace(v, 'null');
		if(t.hasClass('active')){
			t.removeClass('active');
			p.css('font-feature-settings', V);
		}else{
			t.addClass('active');
			if(c != 'normal'){
				p.css('font-feature-settings', c + ', "'+ v +'"');
			}else{
				p.css('font-feature-settings', '"'+ v +'"');
			}
		}
	});

	//Change editable rows text and input range vlaue on resize
	$(window).on('resize', function(){
		$('.module-type-handler').each(function(){
			var t = $(this),
				 min = t.attr('min'),
				 max = t.attr('max'),
				 cols4 = t.data('cols4'),
				 cols2 = t.data('cols2'),
				 v,
				 n = t.parent().parent().next('.module-type-editable');

			setHandlers(t,v,min,max);

			if(t.hasClass('virgin')){
				var v = t.val();
				typeColumns(n,v,cols2,cols4);
			}

		});
	});

	//Clear formating on pasted text
	let editable = document.querySelectorAll('.module-type-editable');
	editable.forEach(function(t){
		t.addEventListener('paste', function(e){
			e.preventDefault();
			var text = e.clipboardData.getData('text/plain');
			document.execCommand('insertText', false, text);
		});
	});

	//Lazy Loading
	var P = [].slice.call(document.querySelectorAll('.picture > source')),
		 L = [].slice.call(document.querySelectorAll('.lazy'));
	if('IntersectionObserver' in window){
		let o = new IntersectionObserver(function(E, observer){
			E.forEach(function(e){
				if(e.isIntersecting){
					let t = e.target;
					if(t.parentElement.tagName == 'PICTURE'){
						t.srcset = t.dataset.srcset;
						t.parentElement.classList.remove('picture');
					}
					if(t.tagName == 'VIDEO'){
						var w = window.innerWidth;
						if(w > 1180){
							if(t.dataset.src1080 != '#t=0.1'){
								t.src = t.dataset.src1080;
							}else if(t.dataset.src720 != '#t=0.1'){
								t.src = t.dataset.src720;
							}else if(t.dataset.src480 != '#t=0.1'){
								t.src = t.dataset.src480;
							}
						}
						if(w > 768 && w < 1181){
							if(t.dataset.src720 != '#t=0.1'){
								t.src = t.dataset.src720;
							}else if(t.dataset.src480 != '#t=0.1'){
								t.src = t.dataset.src720;
							}else if(t.dataset.src1080 != '#t=0.1'){
								t.src = t.dataset.src1080;
							}
						}
						if(w < 769){
							if(t.dataset.src480 != '#t=0.1'){
								t.src = t.dataset.src480;
							}else if(t.dataset.src720 != '#t=0.1'){
								t.src = t.dataset.src720;
							}else if(t.dataset.src1080 != '#t=0.1'){
								t.src = t.dataset.src1080;
							}
						}
						var P = t.play();
						if(P !== undefined){
							P.catch(error => {
								t.controls = true;
								t.classList.add('no-autoplay');
							});
						}
						t.classList.remove('lazy');
					}
					o.unobserve(t);
				}
			});
		}, {rootMargin: '0px 0px 0px 0px'});
		P.forEach(function(t){
			o.observe(t);
		});
		L.forEach(function(t){
			o.observe(t);
		});
	}else{
		// Not supported, load all images immediately
		P.forEach(function(p){
			p.nextElementSibling.datasrc = p.nextElementSibling.dataset.srcset;
			p.parentElement.classList.remove('picture');
		});
		L.forEach(function(l){
			l.src = l.dataset.src;
			l.classList.remove('lazy');
		});
	}

});

/*404*/
$.ajax({
	statusCode: {
		404: function(){
			window.location = window.location.origin;
		}
	}
});
