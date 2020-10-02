import axios from 'axios';
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment';

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(item) {
  axios.post('/update-cart', item).then(res => {
    cartCounter.innerText = res.data.totalQty
    new Noty({
      type: 'success',
      timeout: 1000,
      text: 'Item added to cart',
      progressBar: false,
      
      
  }).show();
  }).catch(err => {
    new Noty({
      type: 'error',
      timeout: 1000,
      text: 'Something went wrong',
      progressBar: false,
    })
  })
}


addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let item = JSON.parse(btn.dataset.item)
    updateCart(item);
    // console.log(item);
   
  })
})

//Remove alert message after x second
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
  setTimeout(() => {
    alertMsg.remove()
  }, 2000);
}

//admin section
initAdmin();

let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);

//add quick view

const details = document.querySelectorAll('.view')
details.forEach((view) => {
  view.addEventListener('click',() => {
    detail = JSON.parse(view.dataset.details);
    fullDetails(detail)
  })
})

function fullDetails(details) {
  axios.post('/popup', details).then(() => {
    
  })
}

//image zooming

function imageZoom(imgID){
  let img = document.getElementById(imgID)
  let lens = document.getElementById('lens')
  lens.style.backgroundImage = `url( ${img.src} )`
  let ratio = 2

  lens.style.backgroundSize = (img.width * ratio) + 'px ' + (img.height * ratio) + 'px';

  img.addEventListener("mousemove", moveLense)
  lens.addEventListener("mousemove", moveLense)
  img.addEventListener("touchmove", moveLense)

  function moveLense() {
    let pos = getCurser()
    console.log(('pos', pos));

    let positionLeft = pos.x -(lens.offsetWidth / 2)
    let positionTop = pos.y -(lens.offsetHeight / 2)

    if(positionLeft < 0) {
      positionLeft = 0
    }
    if(positionTop < 0) {
      positionTop = 0
    }
    if(positionLeft > img.width - lens.offsetWidth /3) {
      positionLeft = img.width - lens.offsetWidth /3
    }
    if(positionTop > img.height - lens.offsetHeight /3) {
      positionTop = img.height - lens.offsetHeight /3
    }

    lens.style.left = positionLeft + 'px';
    lens.style.top = positionTop + 'px';

    lens.style.backgroundPosition = "-" + (pos.x * ratio) + 'px -' +  (pos.y * ratio) + 'px'
  }

  function getCurser() {
    let e = window.event
    let bounds = img.getBoundingClientRect()

    // console.log('e', e);
    // console.log('bounds', bounds);

    let x = e.pageX - bounds.left
    let y = e.pageY - bounds.top
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    
    return {'x': x, 'y': y}
  }
}

imageZoom('featured')


//organi template


'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Gallery filter
        --------------------*/
        $('.featured__controls li').on('click', function () {
            $('.featured__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.featured__filter').length > 0) {
            var containerEl = document.querySelector('.featured__filter');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Humberger Menu
    $(".humberger__open").on('click', function () {
        $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").addClass("active");
        $("body").addClass("over_hid");
    });

    $(".humberger__menu__overlay").on('click', function () {
        $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").removeClass("active");
        $("body").removeClass("over_hid");
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*-----------------------
        Categories Slider
    ------------------------*/
    $(".categories__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            0: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 3,
            },

            992: {
                items: 4,
            }
        }
    });


    $('.hero__categories__all').on('click', function(){
        $('.hero__categories ul').slideToggle(400);
    });

    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    $(".latest-product__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------------
        Product Discount Slider
    -------------------------------*/
    $(".product__discount__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            320: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 2,
            },

            992: {
                items: 3,
            }
        }
    });

    /*---------------------------------
        Product Details Pic Slider
    ----------------------------------*/
    $(".product__details__pic__slider").owlCarousel({
        loop: true,
        margin: 20,
        items: 4,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------
		Price Range Slider
	------------------------ */
    var rangeSlider = $(".price-range"),
        minamount = $("#minamount"),
        maxamount = $("#maxamount"),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
    rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function (event, ui) {
            minamount.val('$' + ui.values[0]);
            maxamount.val('$' + ui.values[1]);
        }
    });
    minamount.val('$' + rangeSlider.slider("values", 0));
    maxamount.val('$' + rangeSlider.slider("values", 1));

    /*--------------------------
        Select
    ----------------------------*/
    $("select").niceSelect();

    /*------------------
		Single Product
	--------------------*/
    $('.product__details__pic__slider img').on('click', function () {

        var imgurl = $(this).data('imgbigurl');
        var bigImg = $('.product__details__pic__item--large').attr('src');
        if (imgurl != bigImg) {
            $('.product__details__pic__item--large').attr({
                src: imgurl
            });
        }
    });

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });

})(jQuery);