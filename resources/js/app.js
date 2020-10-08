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

const upqty = document.querySelectorAll('.upqty')
    upqty.forEach(upqty => {
        upqty.addEventListener('click', () => {
            // console.log('hi');
            const newqty = JSON.parse(upqty.dataset.upqty)
            updateqty(newqty);
        })
    })

    function updateqty(newqty) {
        axios.post('/updateupqty', newqty.item).then(() => {
            location.reload();
        }).catch(err => {
          location.reload();
        })
    }


    const downqty = document.querySelectorAll('.downqty')
    downqty.forEach(downqty => {
        downqty.addEventListener('click', () => {
            // console.log('hi');
            const newqty = JSON.parse(downqty.dataset.downqty)
            updatedownqty(newqty);
        })
    })

    function updatedownqty(newqty) {
        axios.post('/updatedownqty', newqty.item).then(() => {
            location.reload();
        }).catch(err => {
          location.reload();
        })
    }

    const deleteItem = document.querySelectorAll('.deleteItem')

    function deleteItems(dele) {
      axios.post('/deleteCartItem', dele.item).then(() => {
        location.reload();

      }).catch(err => {
        location.reload();
      })
    }

    deleteItem.forEach(dele => {
      dele.addEventListener('click', () => {
        const del = JSON.parse(dele.dataset.dele);
        deleteItems(del);
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
