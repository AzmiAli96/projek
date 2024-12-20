import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Checkout from "@/components/Pembayaran/checkout";
import { Toaster } from "react-hot-toast";


const CartPage = () => {
    return(
        <DefaultLayout>
            <Toaster position="top-right" reverseOrder={false}/>
            <Checkout/>
        </DefaultLayout>
    );
};

export default CartPage;