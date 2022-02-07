$(document).ready(function() {
	var sortLi = function () {
		var items = document.querySelectorAll('.timeline li');
		var sortedItems = [];
		items.forEach(function (item) {
			var items = item.id.split('-');
			item.id = new Date('20' + items[2], items[1] - 1, items[0]).getTime();
			sortedItems.push(item);
		});
		sortedItems.sort((a, b) => a.id.localeCompare(b.id));
		// Replace the elements in the DOM with the sorted elements
		for (var i = 0; i < sortedItems.length; i++) {
			sortedItems[i].parentNode.appendChild(sortedItems[i]);
		}
	};
	sortLi();

	$('#security-up-link').css({'opacity': '0%'});
	$('#security-up-link').css({'visibility': 'hidden'});
});

(function ($) {

	"use strict";


	$(window).stellar({
		responsive: true,
		parallaxBackgrounds: true,
		parallaxElements: true,
		horizontalScrolling: false,
		hideDistantElements: false,
		scrollProperty: 'scroll'
	});


	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	// loader
	var loader = function () {
		setTimeout(function () {
			if ($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
		}, 1);
	};
	loader();

	// Scrollax
	$.Scrollax();

	var carousel = function () {
		$('.carousel-testimony').owlCarousel({
			center: true,
			loop: true,
			items: 1,
			margin: 30,
			stagePadding: 0,
			nav: false,
			navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 3
				}
			}
		});
		$('.carousel-properties').owlCarousel({
			center: true,
			loop: true,
			items: 1,
			margin: 30,
			stagePadding: 0,
			nav: false,
			navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 3
				}
			}
		});

	};
	carousel();

	$('nav .dropdown').hover(function () {
		var $this = $(this);
		// 	 timer;
		// clearTimeout(timer);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		// $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').addClass('show');
	}, function () {
		var $this = $(this);
		// timer;
		// timer = setTimeout(function(){
		$this.removeClass('show');
		$this.find('> a').attr('aria-expanded', false);
		// $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').removeClass('show');
		// }, 100);
	});


	$('#dropdown04').on('show.bs.dropdown', function () {
		console.log('show');
	});

	var navlinks = ["#home-link", "#about-link", "#architecture-link", "#devices-link", "#ui-link", "#data-gen-link", "#data-flow-link", "#frontend-link", "#backend-link", '#hardware-link', '#security-link', "#features-link", '#research-link', "#milestones-link", "#budget-link", "#contact-link"];

	var navColor = function (id) {
		for (var i = 0; i < navlinks.length; i++) {
			if (i == id) continue;
			if ($(navlinks[i]).hasClass('active')) $(navlinks[i]).removeClass('active');
		}
		$(navlinks[id]).addClass('active');
	};

	// scroll
	var scrollWindow = function () {
		$(window).scroll(function () {
			var $w = $(this),
				st = $w.scrollTop(),
				navbar = $('.ftco_navbar'),
				sd = $('.js-scroll-wrap');

			if (st > 150) {
				if (!navbar.hasClass('scrolled')) {
					navbar.addClass('scrolled');
				}
			}
			if (st < 150) {
				if (navbar.hasClass('scrolled')) {
					navbar.removeClass('scrolled sleep');
				}
			}
			if (st > 350) {
				if (!navbar.hasClass('awake')) {
					navbar.addClass('awake');
				}

				if (sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if (st < 350) {
				if (navbar.hasClass('awake')) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if (sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
			if (st <= $("#about").offset().top - 70) navColor(0);
			else if (st > $("#about").offset().top - 70 && st <= $("#architecture").offset().top - 70) navColor(1);
			else if (st > $("#architecture").offset().top - 70 && st <= $("#devices").offset().top - 850) {
				navColor(2);
				$('#architecture-down-link span').removeClass('fa-arrow-up');
				$('#architecture-down-link span').addClass('fa-arrow-down');
			}
			else if (st > $("#devices").offset().top - 850 && st <= $("#devices").offset().top - 70) {
				navColor(2);
				$('#architecture-down-link span').removeClass('fa-arrow-down');
				$('#architecture-down-link span').addClass('fa-arrow-up');
			}
			else if (st > $("#devices").offset().top - 70 && st <= $("#ui").offset().top - 70) navColor(3);
			else if (st > $("#ui").offset().top - 70 && st <= $("#data-gen").offset().top - 70) navColor(4);
			else if (st > $("#data-gen").offset().top - 70 && st <= $("#data-flow").offset().top - 70) navColor(5);
			else if (st > $("#data-flow").offset().top - 70 && st <= $("#frontend").offset().top - 70) navColor(6);
			else if (st > $("#frontend").offset().top - 70 && st <= $("#backend").offset().top - 70) navColor(7);
			else if (st > $("#backend").offset().top - 70 && st <= $("#hardware").offset().top - 70) navColor(8);
			else if (st > $("#hardware").offset().top - 70 && st <= $("#security").offset().top - 780) {
				navColor(9);
				$('#hardware-down-link span').removeClass('fa-arrow-up');
				$('#hardware-down-link span').addClass('fa-arrow-down');
				$('#hardware-down-link').removeClass('up');
				$('#hardware-down-link').addClass('down');
			}
			else if (st > $("#security").offset().top - 780 && st <= $("#security").offset().top - 70) {
				navColor(9);
				$('#security-down-link').css({'opacity': '0%'});
				$('#security-down-link').css({'visibility': 'hidden'});
				$('#hardware-down-link span').addClass('fa-arrow-up');
				$('#hardware-down-link span').removeClass('fa-arrow-down');
				$('#hardware-down-link').removeClass('down');
				$('#hardware-down-link').addClass('up');
			}
			else if (st > $("#security").offset().top - 70 && st <= $("#security2").offset().top - 90) {
				navColor(10);
				$('#security-down-link').css({'visibility': 'visible'});
				$('#security-down-link').css({'opacity': '100%'});
				$('#security-up-link').css({'opacity': '0%'});
				$('#security-up-link').css({'visibility': 'hidden'});
			}
			else if (st > $("#security2").offset().top - 90 && st <= $("#features").offset().top - 79) {
				navColor(10);
				$('#security-down-link').css({'opacity': '0%'});
				$('#security-down-link').css({'visibility': 'hidden'});
				$('#security-up-link').css({'visibility': 'visible'});
				$('#security-up-link').css({'opacity': '100%'});
			}
			else if (st > $("#features").offset().top - 79 && st <= $("#research").offset().top - 70) navColor(11);
			else if (st > $("#research").offset().top - 70 && st <= $("#milestones").offset().top - 79) {
				navColor(12);
				$('#security-up-link').css({'opacity': '0%'});
				$('#security-up-link').css({'visibility': 'hidden'});
			}
			else if (st > $("#milestones").offset().top - 79 && st <= $("#budget").offset().top - 70) navColor(13);
			else if (st > $("#budget").offset().top - 70 && st <= $("#footer").offset().top - 81) navColor(14);
			else navColor(15);
		});
	};
	scrollWindow();


	var counter = function () {

		$('#section-counter, .hero-wrap, .ftco-counter').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function () {
					var $this = $(this),
						num = $this.data('number');
					console.log(num);
					$this.animateNumber({
						number: num,
						numberStep: comma_separator_number_step
					}, 7000);
				});

			}

		}, {
			offset: '95%'
		});

	}
	counter();


	var contentWayPoint = function () {
		var i = 0;
		$('.ftco-animate').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function () {

					$('body .ftco-animate.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						}, k * 50, 'easeInOutExpo');
					});

				}, 100);

			}

		}, {
			offset: '95%'
		});
	};
	contentWayPoint();

	// magnific popup
	$('.image-popup').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		closeBtnInside: false,
		fixedContentPos: true,
		mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			verticalFit: true
		},
		zoom: {
			enabled: true,
			duration: 300 // don't foget to change the duration also in CSS
		}
	});

	$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,

		fixedContentPos: false
	});

	$("#home-link").click(function () {
		$('html, body').animate({
			scrollTop: 0
		}, 600, 'easeInOutExpo');
	});

	$("#about-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#about").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#architecture-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#architecture").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#architecture-down-link").click(function () {
		if ($('#architecture-down-link span').hasClass('fa-arrow-down'))
			$('html, body').animate({
				scrollTop: $("#devices").offset().top - 760
			}, 600, 'easeInOutExpo');
		else
			$('html, body').animate({
				scrollTop: $("#architecture").offset().top - 60
			}, 600, 'easeInOutExpo');
	});

	$("#devices-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#devices").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#ui-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#ui").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#data-gen-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#data-gen").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#data-flow-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#data-flow").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#frontend-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#frontend").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#backend-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#backend").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#hardware-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#hardware").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#hardware-down-link").click(function () {
		if ($('#hardware-down-link span').hasClass('fa-arrow-down'))
			$('html, body').animate({
				scrollTop: $("#security").offset().top - 760
			}, 600, 'easeInOutExpo');
		else
			$('html, body').animate({
				scrollTop: $("#hardware").offset().top - 60
			}, 600, 'easeInOutExpo');
	});
	
	$("#security-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#security").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#features-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#features").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#research-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#research").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#milestones-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#milestones").offset().top - 69
		}, 600, 'easeInOutExpo');
	});

	$("#budget-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#budget").offset().top - 60
		}, 600, 'easeInOutExpo');
	});

	$("#contact-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#footer").offset().top - 71
		}, 600, 'easeInOutExpo');
	});
	
	$("#security-down-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#security2").offset().top - 60
		}, 650, 'easeInOutExpo');
	});

	$("#security-up-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#security").offset().top - 60
		}, 650, 'easeInOutExpo');
	});

	$("#data-down-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#data-flow").offset().top - 100
		}, 650, 'easeInOutExpo');
	});

	$("#data-up-link").click(function () {
		$('html, body').animate({
			scrollTop: $("#data-gen").offset().top - 70
		}, 650, 'easeInOutExpo');
	});

	$(function () {
		$(".adjective").typed({
			strings: ["Remotely.", "Interactively.", "In the comfort of your own Home."],
			typeSpeed: 50,
			backSpeed: 25,
			backDelay: 2000,
			loop: true
		});
	});

	$('#play-video').on('click', function(e){
		e.preventDefault();
		$('#video-overlay').addClass('open');
		$("#video-overlay").append('<iframe width="960" height="540" src="https://www.youtube.com/embed/UrKorkKD-kg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
	  });
	  
	  $('.video-overlay, .video-overlay-close').on('click', function(e){
		e.preventDefault();
		close_video();
	  });
	  
	  $(document).keyup(function(e){
		if(e.keyCode === 27) { close_video(); }
	  });
	  
	  function close_video() {
		$('.video-overlay.open').removeClass('open').find('iframe').remove();
	  };

})(jQuery);