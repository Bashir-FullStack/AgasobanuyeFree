import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../utils/api";
import { API } from "../config";
import ProductTableRow from "./ProductTableRow";

const MAX_CATEGORIES = 8;
const PRODUCTS_PER_CATEGORY = 10;

export default function CategoryProductSections() {
  const { data: categories } = useFetch("/categories");
  const [sections, setSections] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    const cats = categories.slice(0, MAX_CATEGORIES);
    Promise.all(
      cats.map(cat =>
        fetch(`${API}/products?category=${encodeURIComponent(cat.name)}&limit=${PRODUCTS_PER_CATEGORY}`)
          .then(r => r.json())
          .then(data => {
            const products = Array.isArray(data) ? data : data?.products || [];
            return { ...cat, products };
          })
          .catch(() => ({ ...cat, products: [] }))
      )
    ).then(setSections).then(() => setLoaded(true));
  }, [categories]);

  if (!loaded) return null;
  if (sections.every(s => s.products.length === 0)) return null;

  return (
    <>
      {sections.map((cat) => {
        if (cat.products.length === 0) return null;
        return (
          <section key={cat._id} className="mb-10">
            <div className="max-w-[1430px] mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">{cat.name}</h2>
                </div>
                <Link to={`/category/${cat.name?.toLowerCase()}`} className="text-xs md:text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                  See More &nbsp;→
                </Link>
              </div>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <div className="-mr-[2px] -mb-[2px]">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {cat.products.slice(0, 10).map((p) => (
                      <div key={p.id || p._id} className="border-r-2 border-b-2 border-gray-200">
                        <ProductTableRow product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
