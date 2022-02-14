import axios from "axios";
import { getAllCates } from "../../../api/category";
import { get, update } from "../../../api/product";
import HeaderAdmin from "../../components/header";

const editProduct = {
    async print(id) {
        const { data } = await get(id);
        const categorys = await getAllCates();
        return /*html*/ `
            <header class="bg-white shadow">
            ${HeaderAdmin.print()}
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 class="text-3xl font-bold text-gray-900">
                    Sửa sản phẩm
                </h1>
            </div>
            </header>
            <main>
                <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <!-- Replace with your content -->
                    <div class="px-4 py-6 sm:px-0">
                        <div class="">
                            <form id="formEditProduct">
                            <input type="hidden" name="id" value="${data.id}">
                                <label for="">Tên sản phẩm:
                                    <input type="text" id="name" name="name" value="${data.name}" placeholder="Tên sản phẩm">
                                </label>
                                <p id="checkName"></p>
                                <label for="">Giá:
                                    <input type="number" min="0" id="price" value="${data.price}" name="price" placeholder="Giá sản phẩm">
                                </label>
                                <label for="">Loại sản phẩm:
                                    <select id="cates" name="cates" class="capitalize">
                                       ${categorys.data.map((post) =>/*html*/`
                                        <option value="${post.id}" ${data.catesId == post.id ? "selected" : ""}>${post.catesName}</option>

                                       `)}
                                    </select>
                                </label>                              
                                
                                <label for="">Hình ảnh:
                                    <div  id="#formEditProduct-img">
                                        <img src="${data.img}" width="150px">
                                        <input type="hidden" name="imgOld" value="${data.img}">
                                        <input type="file" class="h-14" id="img" name="img">
                                    </div>
                                    
                                </label>   
                                
                                <p id="checkImg"></p>                                               
                                <a href="/admin/list-product" >Hủy</a>
                                <button type="submit">Lưu</button>
                            </form>
                        </div>
                    </div>
                    <!-- /End replace -->
                </div>
            </main>
        `
    },
    afterRender(id) {
        const formEditProduct = document.querySelector('#formEditProduct');

        const CLOUDINARY_API = "https://api.cloudinary.com/v1_1/hungtv/image/upload";
        const CLOUDINARY_PRESET = "s9esu1dx";

        formEditProduct.addEventListener('submit', async (e) => {
            e.preventDefault();
            let image = "";
            // const name = formAddProduct.name.value;
            // const price = formAddProduct.price.value;
            // const img = formAddProduct.img.value;

            // Lấy giá trị input file
            const file = formEditProduct.img.files[0];

            // append vào object formData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET)
            if (file) {
                const response = await axios.post(CLOUDINARY_API, formData, {
                    headers: {
                        "Content-Type": "application/form-data"
                    }
                })
                image = response.data.url
            } else {
                image = formEditProduct.imgOld.value;
            }
            // call api cloudinary

            //       call api thêm bài viết
            update({
                id: formEditProduct.id.value,
                "name": document.querySelector('#name').value,
                "img": image,
                "price": document.querySelector('#price').value,
                "cateId": document.querySelector('#cates').value,
            }).then(res => window.location.href = "/admin/list-product");
        })
    }
}

export default editProduct;