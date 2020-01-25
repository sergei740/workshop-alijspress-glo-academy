document.addEventListener('DOMContentLoaded', () => {
   const search = document.getElementById('searchGoods');
   const cartBtn = document.getElementById('cart');
   const cart = document.querySelector('.cart');
   const wishlistBtn = document.getElementById('wishlist');
   const goodsWrapper = document.querySelector('.goods-wrapper');
   const categoryList = document.querySelector('.category-list');
   const counterWishlist = document.querySelector('#wishlist > span');
   const counterBaslet = document.querySelector('#cart > spathForDeploy = 'https://github.com/sergei740/workshop-alijspress-glo-academy/blob/master/db/db.json';

   let wishlist = localStorage.wishlist ? [...JSON.parse(localStorage.wishlist)] : [];
   let basket = localStorage.basket ? [...JSON.parse(localStorage.basket)] : [];
   let total = localStorage.total ? [...JSON.parse(localStorage.total)] : [];

   const loading = () => {
      goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
      </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`;
   };

   const htmlCard = ({ id, imgMin, title, price }) => {
      return `<div class="card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3">
                <div class="card">
                    <div class="card-img-wrapper">
                        <img class="card-img-top" src=${imgMin} alt="">
                        <button class="card-add-wishlist 
                           ${wishlist.includes(id) ? 'active' : null}" 
                           data-goods-id=${id}></button>
                    </div>
                    <div class="card-body justify-content-between">
                        <a href="#" class="card-title">${title}</a>
                        <div class="card-price">${price} ₽</div>
                        <div>
                            <button class="card-add-cart" data-goods-id=${id} data-goods-price=${price}>Добавить в корзину</button>
                        </div>
                    </div>
                </div>
            </div>`;
   };

   const htmlCart = ({ id, imgMin, title, price }) => {
      return `<div class="goods">
                  <div class="goods-img-wrapper">
                     <img class="goods-img" src=${imgMin} alt="">
                  </div>
                  <div class="goods-description">
                     <h2 class="goods-title">${title}</h2>
                     <p class="goods-price">${price} ₽</p>
                  </div>
                  <div class="goods-price-count">
                     <div class="goods-trigger">
                        <button class="goods-add-wishlist"></button>
                        <button class="goods-delete" data-goods-id=${id} data-goods-price=${price}></button>
                     </div>
                     <div class="goods-count">${basket.filter(item => item === id).length}</div>
                  </div>
               </div>`;
   };

   const getCounterWishlist = () => {
      counterWishlist.innerHTML = wishlist.length;
   };

   const getCounterBasket = () => {
      counterBaslet.innerHTML = basket.length;
   };

   const randomSort = item => item.sort(() => Math.random() - 0.5);

   const addIdBasket = id => {
      basket.push(id);
      storageQuery();
   };

   const addToTotal = price => {
      total.push(price);
      storageQuery();
   };

   const addToWishlist = e => {
      const target = e.target;

      if (target.classList.contains('card-add-wishlist')) {
         target.classList.toggle('active');
         toggleWishlist(target.dataset.goodsId);
      }
   };

   const addToBasket = e => {
      const target = e.target;

      if (target.classList.contains('card-add-cart')) {
         addIdBasket(target.dataset.goodsId);
         addToTotal(target.dataset.goodsPrice);
         getCounterBasket();
      }
   };

   const storageQuery = () => {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      localStorage.setItem('basket', JSON.stringify(basket));
      localStorage.setItem('total', JSON.stringify(total));
   };

   const toggleWishlist = id => {
      !wishlist.includes(id)
         ? wishlist.push(id)
         : (wishlist = wishlist.filter(itemList => !itemList.includes(id)));

      getCounterWishlist();
      storageQuery();
   };

   const countTotal = total => {
      return total.reduce((acc, item) => parseFloat(acc) + parseFloat(item), 0).toFixed(2);
   };

   const deleteFromBasket = e => {
      const target = e.target;

      if (target.classList.contains('goods-delete')) {
         basket = basket.filter(item => item !== target.dataset.goodsId);
         total = total.filter(item => item !== target.dataset.goodsPrice);
         countTotal(total);
         renderBasketCart();
         getCounterBasket();
         storageQuery();
      }
   };

   const renderAllCards = () => {
      getCounterWishlist();
      getCounterBasket();
      loading();
      fetch(pathForDeploy)
         .then(res => res.json())
         .then(randomSort)
         .then(data => {
            goodsWrapper.innerHTML = data
               .map(item => htmlCard(item))
               .reduce((acc, item) => acc + item);
         });
   };

   const rendefilterSearchrCard = value => {
      loading();
      fetch(pathForDeploy)
         .then(res => res.json())
         .then(data => {
            const filterData = data.filter(item => {
               return item.title.toLowerCase().includes(value.toLowerCase().trim());
            });
            const newData = filterData.map(item => htmlCard(item));

            newData.length !== 0
               ? (goodsWrapper.innerHTML = newData.reduce((acc, item) => acc + item))
               : (goodsWrapper.innerHTML = 'По вашему запросу ничего не найдено');
         });
   };

   const renderCardByDataset = (dataset, data) => {
      const filterData = data.filter(item => item.category.includes(dataset));
      const newData = filterData.map(item => htmlCard(item));
      if (newData.length !== 0) {
         goodsWrapper.innerHTML = newData.reduce((acc, item) => acc + item);
      }
   };

   const renderWishlist = () => {
      fetch(pathForDeploy)
         .then(res => res.json())
         .then(data => {
            if (wishlist.length !== 0) {
               const filterData = data
                  .filter(item => wishlist.includes(item.id))
                  .map(item => htmlCard(item))
                  .reduce((acc, item) => acc + item);
               goodsWrapper.innerHTML = filterData;
            } else {
               goodsWrapper.innerHTML = `Ваш список желаний пуст`;
            }
         });
   };

   const renderBasketCart = () => {
      fetch(pathForDeploy)
         .then(res => res.json())
         .then(data => {
            if (basket.length) {
               const filterData = data
                  .filter(item => basket.includes(item.id))
                  .map(item => htmlCart(item))
                  .reduce((acc, item) => acc + item);
               cart.innerHTML = `<div class="cart-body">
                                 <div class="cart-head">
                                    <div class="cart-title">Корзина</div>
                                    <div class="cart-total">
                                       Общая сумма: 
                                       <span>
                                          ${countTotal(total)}
                                       </span> руб
                                    </div>
                                 </div>
                                 <div class="cart-wrapper">
                                    ${filterData}
                                 </div>
                                 <button class="btn btn-primary cart-confirm">Оформить заказ</button>
                                 <div class="cart-close">
                                 
                                 </div>
                              </div>`;
            } else {
               cart.innerHTML = `<div class="cart-body">
                                    <div class="cart-head">
                                       <div class="cart-title">Корзина</div>
                                       <div class="cart-total">Общая сумма: <span>0</span> руб</div>
                                    </div>
      
                                    <div class="cart-wrapper">
                                       <div id="cart-empty">
                                          Ваша корзина пока пуста
                                    </div>
                        
			                           <div class="cart-close">

			                           </div>
                                 </div>`;
            }
         });
   };

   const getCardsByCategory = e => {
      loading();
      setTimeout(() => {
         fetch(pathForDeploy)
            .then(res => res.json())
            .then(data => {
               e.preventDefault();
               const targetCategory = e.target.dataset.category;
               renderCardByDataset(targetCategory, data);
            });
      }, 1000);
   };

   const openBasket = e => {
      e.preventDefault();
      cart.style.display = 'flex';
   };

   const closeBasket = e => {
      const targetСlassListValue = e.target.classList.value;
      targetСlassListValue === 'cart' || targetСlassListValue === 'cart-close'
         ? (cart.style.display = '')
         : null;
   };

   function throttle(func, ms) {
      let isThrottled = false,
         savedArgs,
         savedThis;

      function wrapper() {
         if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
         }

         func.apply(this, arguments);

         isThrottled = true;

         setTimeout(function() {
            isThrottled = false;
            if (savedArgs) {
               wrapper.apply(savedThis, savedArgs);
               savedArgs = savedThis = null;
            }
         }, ms);
      }

      return wrapper;
   }

   const debounce1000 = throttle(rendefilterSearchrCard, 2000);

   renderAllCards();
   document.addEventListener('keydown', e => (e.keyCode === 27 ? (cart.style.display = '') : null));
   categoryList.addEventListener('click', getCardsByCategory);
   search.addEventListener('input', e => debounce1000(e.target.value));
   wishlistBtn.addEventListener('click', renderWishlist);
   goodsWrapper.addEventListener('click', e => {
      addToBasket(e);
      addToWishlist(e);
   });
   cartBtn.addEventListener('click', e => {
      openBasket(e);
      renderBasketCart();
   });
   cart.addEventListener('click', e => {
      closeBasket(e);
      deleteFromBasket(e);
   });
});
