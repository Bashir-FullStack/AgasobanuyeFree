import { useFetch } from "../utils/api";
import ProductTableRow from "../components/ProductTableRow";

export default function PricesDropPage() {
  const { data: products, loading } = useFetch("/products/prices-drop");
  const onSale = products || [];

  if (loading) return <div className="bg-gray-50 min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[1430px] mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-dark">Prices Drop</h1>
          <p className="text-sm text-gray-500 mt-1">{onSale.length} products with reduced prices</p>
        </div>
      </div>
      <div className="max-w-[1430px] mx-auto px-4 py-6">
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
          <div className="-mr-[2px] -mb-[2px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {onSale.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 text-sm">No price drops available.</div>
              ) : onSale.map((p) => (
                <div key={p.id} className="border-r-2 border-b-2 border-gray-200"><ProductTableRow product={p} /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
