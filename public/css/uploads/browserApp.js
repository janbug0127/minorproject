
console.log('entered');
const url = "/"

const fileFormDOM = document.querySelector('.file-form')
console.log(fileFormDOM);
const nameInputDOM = document.querySelector('#titleinput')
const priceInputDOM = document.querySelector('#posttext')
const imageInputDOM = document.querySelector('#image')
console.log(imageInputDOM);

// const containerDOM = document.querySelector('.container')
let imageValue;

// imageInputDOM.addEventListener('change',(e)=>{
//  const file = e.target.files[0];
//  console.log(file);
// })






imageInputDOM.addEventListener('change',async (e)=>{
 const imageFile = e.target.files[0];
 const formData = new FormData();
 formData.append('image',imageFile)
    console.log("Hello inside");
 try {
  const {data:{image:{src}}} = await axios.post(`/upload`,formData,{
   headers:{
    'Content-Type':'multipart/form-data'
   } 
  })
  imageValue = src
  console.log(imageValue);
 } catch (error) {
   imageValue = null
  console.log(error);
 }
})


fileFormDOM.addEventListener('submit',async (e)=>{
e.preventDefault()

const nameValue = nameInputDOM.value;
const priceValue = priceInputDOM.value;
try {
 
 const product = {title:nameValue,content:priceValue,image:imageValue}
 console.log(product);
  const data=await axios.post(`/createFile`,{title:nameValue,content:priceValue,image:imageValue},{
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
  },
  });
  console.log(data);
  //fetchProducts()
} catch (error) {
 console.log(error);
}
})


// async function fetchProducts () {
//  try {
//   const {data:{products}} = await axios.get(url);
  
//   const productsDOM = products.map((product)=>{
// return `<article class="product">

// <p>${product.image}</p>
// <footer>
// <p>${product.name}</p>
// <span>$${product.price}</span>
// </footer>
// </article>`
//   }).join('')
//   containerDOM.innerHTML = productsDOM
//  } catch (error) {
//   console.log(error);
//  }
 
// }

// fetchProducts()