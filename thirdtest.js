

function loadData() {
    $.get('https://fakestoreapi.com/products').done(function(data) {
        originalData = data.slice(); 
        applyFilters();  
    });
}

function addProduct(product) {
    var productHTML = `<div class='products' data-aos="fade-up" data-aos-anchor-placement="center-bottom">
        <div class='image'><img src='${product.image}'></div>
        <div class='title'>${product.title}</div>
        <div class='price'>${product.price}$</div>
        <div class='addshoppingcart hide'>Add to cart</div>
    </div>`;
    $('.container').append(productHTML);
}


var originalData = [];  // Store the original product data
var filteredData = [];  // Data after applying filters
var sortedData = [];
var finalproduct = []; 
var searchproduct = [];    // Data after applying sorting var


function applyFilters(){
    var checkedCategories = $('.check:checked').map(function() {
        return this.value;
    }).get(); //체크된값 value들 반환

    if(checkedCategories.length > 0){
        filteredData = originalData.filter(function(item){
            return checkedCategories.includes(item.category)
        })
    }else{
        filteredData = originalData.slice();
    }

    applySorting(); 
}



function applySorting(){
    var selectValue = $('select').val();
    sortedData = filteredData.slice();

    console.log(selectValue)


    if (selectValue == 'low') {
        sortedData.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (selectValue == 'high') {
        sortedData.sort(function(a, b) {
            return b.price - a.price;
        });
    } else if (selectValue == 'best') {
        sortedData.sort(function(a, b) {
            return b.rating.rate - a.rating.rate;
        });
    }

    applyPriceFilter()

}

function applyPriceFilter() {
    finalproduct = sortedData.slice();

    var minPrice =$('.range-min').val(); 
    var maxPrice = $('.range-max').val(); 

    finalproduct = finalproduct.filter(function(a){
        return a.price >= minPrice && a.price <= maxPrice;
    })

    searchFilter();
}


$('.range-min, .range-max').on('input', applyPriceFilter);



const searchInput = $('.search')
const searchBtn = $('#searchBtn')

function searchFilter(e) {
    if (e) e.preventDefault();  // 이벤트 객체가 있는 경우에만 preventDefault 호출
    const val = searchInput.val(); //공백
    const test = /^\s*$/.test(val)
    
    if(test == true){
        searchproduct = finalproduct.slice();
   
    }else{
        searchproduct = finalproduct.filter(function(a) {
      
            return a.title.toLowerCase().includes(val.toLowerCase());
        });
    }


    redrawProducts();
}


searchBtn.on('click',searchFilter)


function redrawProducts(){
    $('.container').html('');
    searchproduct.forEach(addProduct);
}


$('select, .check').on('change', updateDisplay);

function updateDisplay(){
    applyFilters();
    applySorting();
    applyPriceFilter() ;
    searchFilter();
    redrawProducts();
}

loadData(); 










var click = 0;



$('.filterbutton').on('click',function(){

  click++;
  
  if(click % 2 == 1){
   $('.filter').addClass('close')

   $('.filterbutton').html('OPEN FILTERS')
   $('.content').addClass('contain-bigger');
  }else{
   $('.filter').removeClass('close')
   $('.filterbutton').html('CLOSE FILTERS')
   $('.content').removeClass('contain-bigger');
  }
})




$('.container').on('mouseenter', '.products', function() {
 $(this).find('img').addClass('darken');
 $(this).find('.addshoppingcart').removeClass('hide')

}).on('mouseleave', '.products', function() {
 $(this).find('img').removeClass('darken');
 $(this).find('.addshoppingcart').addClass('hide')
}).on('click','.addshoppingcart',function(){
   $('.modal-container').removeClass('hide')
})



//event-bubbling
$('.modal-container').on('click',function(e){
   if(e.target == this){
    $('.modal-container').addClass('hide')
   }
 })

 //장바구니 

//  var arr = [1,2,3]; 
//  var newArr = JSON.stringify(arr);
 
//  localStorage.setItem('num', newArr)



var shoppingCart = JSON.parse(localStorage.getItem('cart'));


$('.container').on('mouseenter', '.addshoppingcart', function() {
    $(this).css("cursor","pointer")
}).on('click', '.addshoppingcart', function(e) {
   
    var itemPrice = parseFloat($(this).siblings('.price').html().replace(/[^0-9.-]+/g, "")); // 가격 정보를 숫자로 변환


    var shoppingItem = {Name: $(this).siblings('.title').html(),수량:1,가격:itemPrice}
    var shoppingCart = JSON.parse(localStorage.getItem('cart')) || [];


       if(shoppingCart != 'null'){
        var filterSameItemCart = shoppingCart.find(function(item){
            return item.Name.includes($(e.target).siblings('.title').html()) 
           })//이름같은값찾기 
        if(!filterSameItemCart){
            shoppingCart.push(shoppingItem);
           }
           else{
            //이미 있는 아이템의 수량을 업데이트해줘
            var index = shoppingCart.findIndex(function(item){
                return item.Name === filterSameItemCart.Name;
            })
            shoppingCart[index].수량++;
            shoppingCart[index].가격 = itemPrice * shoppingCart[index].수량;
           }
       }


 var newArr = JSON.stringify(shoppingCart);
 localStorage.setItem('cart', newArr)


})


$('.continueshopping').on('click',function(){
    $('.modal-container').addClass('hide')
})



const rangeInput = document.querySelectorAll(".range-input input"),
priceInput = document.querySelectorAll(".price-input input"),
range = document.querySelector(".slider .progress");
let priceGap = 100;

priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);
        
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            }else{
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});


rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

        if((maxVal - minVal) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = maxVal - priceGap
            }else{
                rangeInput[1].value = minVal + priceGap;
            }

        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});


