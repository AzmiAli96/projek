import Cart from "@/components/Cart/cart";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Toaster } from "react-hot-toast";


const CartPage = () => {
    return(
        <DefaultLayout>
            <Toaster position="top-right" reverseOrder={false}/>
            <Cart/>
        </DefaultLayout>
    );
};

export default CartPage;