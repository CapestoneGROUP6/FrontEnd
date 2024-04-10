import { useEffect, useState } from "react"
import API from "services/APIService"
import { OrderInformation } from "types"

export const useUserOrder = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<OrderInformation[]>([]);

    const fetchOrders = () => {
        setLoading(true);
        API.getInstance().get<OrderInformation[]>("/user/orders")
            .then((response) => {
                if (response.data?.length > 0) {
                    setOrders(response.data);
                }
            }).catch(console.log)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { loading, orders, refetch: fetchOrders };
}
