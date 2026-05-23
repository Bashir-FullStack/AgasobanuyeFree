import { useFetch } from "../utils/api";
import ProductTableRow from "../components/ProductTableRow";

export default function NewProductsPage() {
  const { data: products, loading } = useFetch("/products/new");
  const newest = products || [];

  if (loading) return <div className="bg-gray-50 min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[1430px] mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-dark">New Products</h1>
          <p className="text-sm text-gray-500 mt-1">{newest.length} newly added products</p>
        </div>
      </div>
      <div className="max-w-[1430px] mx-auto px-4 py-6">
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
          <div className="-mr-[2px] -mb-[2px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {newest.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 text-sm">No new products at this time.</div>
              ) : newest.map((p) => (
                <div key={p.id} className="border-r-2 border-b-2 border-gray-200"><ProductTableRow product={p} /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
