import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FiHeart, FiRefreshCw, FiShoppingCart, FiMinus, FiPlus, FiTruck, FiRotateCcw, FiShield, FiFacebook, FiTwitter, FiLinkedin, FiMail, FiCheck, FiStar, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { toRWF } from "../utils/currency";
import { badgeDesign } from "../utils/badge";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../utils/api";
import ProductTableRow from "../components/ProductTableRow";
import SEO from "../components/SEO";
import { API } from "../config";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading } = useFetch(`/products/${id}`, [id]);

  useEffect(() => {
    if (!product) return;
    try {
      const raw = localStorage.getItem("hiromart_recently_viewed");
      let viewed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(viewed)) viewed = [];
      viewed = viewed.filter(v => v.id !== product.id && v._id !== product._id);
      viewed.unshift({ id: product.id, _id: product._id, name: product.name, image: product.image, price: product.price });
      if (viewed.length > 20) viewed = viewed.slice(0, 20);
      localStorage.setItem("hiromart_recently_viewed", JSON.stringify(viewed));
    } catch {}
  }, [product]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { addToCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionForm, setQuestionForm] = useState("");
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionSuccess, setQuestionSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      const loadReviews = async () => {
        setReviewsLoading(true);
        try {
          const res = await fetch(`${API}/reviews/product/${product._id || product.id}`);
          if (res.ok) {
            const data = await res.json();
            setReviews(data);
          }
        } catch (err) {
          console.error("Failed to load reviews:", err);
        } finally {
          setReviewsLoading(false);
        }
      };
      loadReviews();
    }
  }, [product, reviewSuccess]);

  useEffect(() => {
    if (product) {
      const loadQuestions = async () => {
        setQuestionsLoading(true);
        try {
          const res = await fetch(`${API}/questions/product/${product._id || product.id}`);
          if (res.ok) {
            const data = await res.json();
            setQuestions(data);
          }
        } catch (err) {
          console.error("Failed to load questions:", err);
        } finally {
          setQuestionsLoading(false);
        }
      };
      loadQuestions();
    }
  }, [product, questionSuccess]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess(false);
    try {
      const token = localStorage.getItem("classyshop_token");
      const res = await fetch(`${API}/reviews`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: id, rating: reviewForm.rating, comment: reviewForm.comment }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to submit review"); }
      setReviewSuccess(true);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!questionForm.trim()) return;
    setQuestionSubmitting(true);
    setQuestionSuccess(false);
    try {
      const token = localStorage.getItem("classyshop_token");
      const res = await fetch(`${API}/questions`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product._id || product.id, question: questionForm }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || "Failed to submit question"); return; }
      setQuestionSuccess(true);
      setQuestionForm("");
    } catch { alert("Failed to submit question"); }
    setQuestionSubmitting(false);
  };

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [zoom, setZoom] = useState({ show: false, x: 50, y: 50 });
  const imgRef = useRef(null);

  const handleZoom = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ show: true, x, y });
  };

  if (loading) return <div className="bg-white min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (!product) return <div className="bg-white min-h-screen flex items-center justify-center text-gray-500 text-sm">Product not found.</div>;

  const allImages = product.images?.length ? product.images : [product.image || `https://picsum.photos/seed/${product.id}/600/600`];
  const relatedProducts = product.related || [];
  const sizes = product.sizes?.length ? product.sizes : [];
  const colors = product.colors?.length ? product.colors : [];

  return (
    <div className="bg-white min-h-screen py-6">
      <SEO
        title={product.name}
        description={product.description || `Buy ${product.name} at hiromart

. ${product.brand ? `Brand: ${product.brand}. ` : ""}Available at the best price in Rwanda.`}
        image={allImages[0]}
        url={`https://hiromart

-client.netlify.app/product/${product._id || product.id}`}
        keywords={`${product.name}, ${product.brand || ""}, ${product.category || ""}, buy online Rwanda, hiromart

`.replace(/\s+/g, ' ').trim()}
      />
      <div className="max-w-[1430px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/categories" className="hover:text-primary">{product.category}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-10">
          {/* Left - Images */}
          <div className="lg:w-[55%] flex gap-4">
            <div className="flex flex-col gap-3 shrink-0">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 overflow-hidden shrink-0 transition ${selectedImage === i ? "border-primary" : "border-gray-200 hover:border-gray-400"}`}>
                  <img loading="lazy" src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 rounded-xl overflow-hidden bg-white cursor-crosshair" onMouseMove={handleZoom} onMouseLeave={() => setZoom(s => ({ ...s, show: false }))}>
              <img loading="lazy" ref={imgRef} src={allImages[selectedImage]} alt={product.name} className="w-full h-[350px] md:h-[500px] object-contain p-6 transition-transform duration-200" style={zoom.show ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : {}} />
              {product.sale && (
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded">{product.sale}</span>
              )}
            </div>
          </div>

          {/* Right - Info */}
          <div className="lg:w-[45%]">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-xs text-gray-400 uppercase tracking-[0.15em] font-semibold">{product.brand}</p>
              <span className="text-[10px] text-gray-400">|</span>
              <Link to={`/category/${(product.category || "").toLowerCase()}`} className="text-xs text-gray-400 uppercase tracking-[0.15em] font-semibold hover:text-primary">{product.category}</Link>
              {product.badge && <span className={`text-[11px] font-bold px-4 py-2 text-white inline-block ${badgeDesign(product.badge).color}`} style={{ clipPath: badgeDesign(product.badge).shape }}>{product.badge}</span>}
              {product.unit && <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{product.unit}</span>}
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-dark leading-tight mb-3">{product.name}</h1>

            {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-yellow-400 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < product.rating ? "★" : "☆"}</span>
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewsLoading ? product.reviews : reviews.length} reviews)</span>
        </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-gray-100">
              <span className="text-2xl md:text-3xl font-bold text-primary">{toRWF(product.price)}</span>
              {product.oldPrice && <span className="text-base text-gray-400 line-through">{toRWF(product.oldPrice)}</span>}
              {product.sale && <span className="bg-primary-light text-primary text-xs font-bold px-2.5 py-0.5 rounded">{product.sale} Off</span>}
            </div>

            {/* Flash sale indicator */}
            {product.saleStart && new Date(product.saleStart) <= new Date() && product.endDate && new Date(product.endDate) > new Date() && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-500 text-lg">🔥</span>
                <div>
                  <p className="text-xs font-bold text-red-600">Flash Sale Active</p>
                  <p className="text-[10px] text-red-500">Ends {new Date(product.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
              </div>
            )}

            {/* Free shipping info */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <FiTruck className="text-blue-500 shrink-0" size={18} />
              <div>
                <p className="text-xs font-semibold text-blue-700">Free shipping on orders over FRw 260,000</p>
                <p className="text-[10px] text-blue-500">Estimated delivery: 2-5 business days from Kigali, Rwanda</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description || "Premium quality product with the best materials."}</p>

            {product.quantity !== undefined && (
              <div className="mb-4 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${product.quantity > 5 ? 'bg-green-500' : product.quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                <span className="text-xs font-medium">{product.quantity > 10 ? 'In Stock' : product.quantity > 0 ? `Only ${product.quantity} left in stock` : 'Out of Stock'}</span>
              </div>
            )}

            {/* Bulk Discount */}
            {product.bulkDiscount && product.bulkDiscount.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-bold text-blue-700 mb-1.5">Volume Pricing</p>
                <div className="space-y-1">
                  {product.bulkDiscount.map((d, i) => (
                    <p key={i} className="text-xs text-blue-600">Buy {d.qty}+ — {toRWF(d.price)}/unit <span className="text-blue-400">(Save {toRWF(product.price - d.price)} each)</span></p>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-dark mb-2">Size <span className="text-gray-400 font-normal">— {selectedSize || "Select"}</span></p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[40px] h-10 px-3 rounded-lg border text-sm font-medium transition ${selectedSize === s ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>{s}</button>
                ))}
              </div>
            </div>
            )}

            {colors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-dark mb-2">Color <span className="text-gray-400 font-normal">— {selectedColor || (colors.length === 1 ? colors[0] : "Select")}</span></p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border-2 transition ${selectedColor === c ? "border-primary scale-110 ring-2 ring-primary/20" : "border-gray-300 hover:border-gray-400"}`} style={{ background: c.startsWith("#") ? c : `#${c}` }} title={c}>
                    {selectedColor === c && <FiCheck className="text-white mx-auto" size={14} />}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Quantity + Add to Cart + Buy It Now */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-gray-50 text-gray-600 transition"><FiMinus size={16} /></button>
                  <span className="px-5 py-2.5 text-sm font-semibold text-dark border-x border-gray-200 min-w-[50px] text-center">{qty}</span>
                  <button onClick={() => product.quantity ? setQty(Math.min(product.quantity, qty + 1)) : setQty(qty + 1)} className="px-3 py-2.5 hover:bg-gray-50 text-gray-600 transition"><FiPlus size={16} /></button>
                </div>
                <button onClick={() => addToCart(product, qty)} disabled={!product.quantity} className="flex-1 bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"><FiShoppingCart size={16} /> {product.quantity ? 'Add to Cart' : 'Out of Stock'}</button>
              </div>
              <button onClick={() => { addToCart(product, qty); navigate("/checkout"); }} disabled={!product.quantity} className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><FiShoppingCart size={16} /> Buy It Now</button>
              {/* Payment logos */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-[10px] text-gray-400">Checkout securely with</span>
                <img loading="lazy" src="https://i.pinimg.com/736x/7f/eb/02/7feb0256dc66ee941c1a5d4c945ed60b.jpg" alt="Visa" className="h-5" />
                <img loading="lazy" src="https://i.pinimg.com/736x/a2/68/8b/a2688b6db24e7fdc9b6de25aa7196345.jpg" alt="Mastercard" className="h-5" />
                <img loading="lazy" src="https://i.pinimg.com/1200x/69/72/3e/69723ed815801e8334a66b6f27edd9de.jpg" alt="PayPal" className="h-5" />
                <img loading="lazy" src="https://i.pinimg.com/736x/d1/08/7d/d1087d1abc263b95a2bea32cd9e70ba0.jpg" alt="Amex" className="h-5" />
              </div>
            </div>

            {/* Wishlist & Compare */}
            <div className="flex gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 px-4 rounded-lg text-sm text-gray-500 hover:text-primary hover:border-primary transition"><FiHeart size={16} /> Add to Wishlist</button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 px-4 rounded-lg text-sm text-gray-500 hover:text-primary hover:border-primary transition"><FiRefreshCw size={16} /> Add to Compare</button>
            </div>

            {/* Social Share */}
            {(() => {
              const url = encodeURIComponent(window.location.href);
              const text = encodeURIComponent(product.name);
              return (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Share:</span>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition"><FiFacebook size={15} /></a>
                  <a href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition"><FiTwitter size={15} /></a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition"><FiLinkedin size={15} /></a>
                  <a href={`https://wa.me/?text=${text}%20${url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition"><FaWhatsapp size={15} /></a>
                  <a href={`mailto:?subject=${text}&body=${url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition"><FiMail size={15} /></a>
                </div>
              );
            })()}

            {/* Delivery Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600"><FiTruck className="text-primary shrink-0" size={16} /><span>Free shipping on orders over FRw 260,000</span></div>
              <div className="flex items-center gap-3 text-sm text-gray-600"><FiRotateCcw className="text-primary shrink-0" size={16} /><span>30 days easy returns</span></div>
              <div className="flex items-center gap-3 text-sm text-gray-600"><FiShield className="text-primary shrink-0" size={16} /><span>Secure checkout guaranteed</span></div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-0">
              {["description", "reviews", "questions"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  {tab === "description" ? "Description" : tab === "reviews" ? `Reviews (${reviewsLoading ? product.reviews : reviews.length})` : `Q&A (${questions.length})`}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm leading-relaxed max-w-4xl" style={{ color: "var(--text-secondary)" }}>
            {activeTab === "description" ? (
              <div className="space-y-4">
                <p>Experience premium quality with the {product.name} from {product.brand}. Crafted with precision and care, this product is designed to meet the highest standards of comfort and durability.</p>
                <p>Whether you're looking for everyday essentials or something special, this product delivers exceptional value and style. Perfect for any occasion, it combines functionality with elegant design.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Premium quality materials</li>
                  <li>Designed for comfort and durability</li>
                  <li>Suitable for everyday use</li>
                  <li>Available in multiple sizes and colors</li>
                  <li>Satisfaction guaranteed</li>
                </ul>
              </div>
            ) : activeTab === "reviews" ? (
              <div>
                {isLoggedIn && (
                  <form onSubmit={handleReviewSubmit} className="mb-8 p-5 rounded-xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Write a Review</h4>
                    {reviewError && <p className="text-red-500 text-xs mb-3">{reviewError}</p>}
                    {reviewSuccess && <p className="text-green-600 text-xs mb-3">Review submitted successfully!</p>}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-xs mr-2" style={{ color: "var(--text-muted)" }}>Rating:</span>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))} className={`text-lg ${s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'}`}><FiStar fill={s <= reviewForm.rating ? 'currentColor' : 'none'} /></button>
                      ))}
                    </div>
                    <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} placeholder="Share your thoughts about this product..." rows={3} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none mb-3" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                    <button type="submit" disabled={reviewSubmitting} className="text-black px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50" style={{ backgroundColor: "#f5c518" }}>{reviewSubmitting ? 'Submitting...' : 'Submit Review'}</button>
                  </form>
                )}
                {reviewsLoading ? (
                  <div className="space-y-5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-4 animate-pulse" style={{ borderColor: "var(--border-color)" }}>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-8 h-8 rounded-full skeleton" />
                          <div><div className="h-3 w-24 skeleton rounded" /><div className="h-2 w-16 skeleton rounded mt-1" /></div>
                        </div>
                        <div className="h-3 w-3/4 skeleton rounded ml-11" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center gap-1 text-2xl mb-2" style={{ color: "var(--text-muted)" }}>
                      {[1,2,3,4,5].map(s => <FiStar key={s} />)}
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No reviews yet. Be the first to review!</p>
                    {!isLoggedIn && (
                      <Link to="/login" className="text-sm font-medium hover:underline mt-1 inline-block" style={{ color: "#f5c518" }}>Sign in to write a review</Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4" style={{ borderColor: "var(--border-color)" }}>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}>
                            {review.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{review.user?.name || 'Anonymous'}</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <div className="flex text-yellow-400 text-xs ml-auto">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <span key={j}>{j < review.rating ? "★" : "☆"}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm ml-11" style={{ color: "var(--text-secondary)" }}>{review.comment || 'No comment provided'}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 ml-11">
                            {review.images.map((img, imgIndex) => (
                              <img loading="lazy" key={imgIndex} src={img} alt="Review" className="w-20 h-20 object-cover rounded-lg" />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {isLoggedIn && (
                  <form onSubmit={handleQuestionSubmit} className="mb-8 p-5 rounded-xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Ask a Question</h4>
                    {questionSuccess && <p className="text-green-600 text-xs mb-3">Question submitted! Admin will answer soon.</p>}
                    <textarea value={questionForm} onChange={e => setQuestionForm(e.target.value)} placeholder="Have a question about this product? Ask here..." rows={3} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none mb-3" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                    <button type="submit" disabled={questionSubmitting} className="text-black px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50" style={{ backgroundColor: "#f5c518" }}>{questionSubmitting ? 'Submitting...' : 'Submit Question'}</button>
                  </form>
                )}
                {questionsLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="border-b pb-4 animate-pulse" style={{ borderColor: "var(--border-color)" }}><div className="h-3 w-3/4 skeleton rounded" /><div className="h-2 w-1/2 skeleton rounded mt-2" /></div>
                    ))}
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto mb-3" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No questions yet. Be the first to ask!</p>
                  </div>
                ) : (
                  questions.map((q, i) => (
                    <div key={i} className="border-b pb-4 mb-4" style={{ borderColor: "var(--border-color)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}>
                          {q.user?.name?.charAt(0) || 'U'}
                        </div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q.user?.name || 'Anonymous'}</p>
                        <p className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>{new Date(q.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                      <p className="text-sm ml-8" style={{ color: "var(--text-secondary)" }}>{q.text}</p>
                      {q.answer && (
                        <div className="ml-8 mt-2 p-3 rounded-lg border" style={{ backgroundColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.2)" }}>
                          <p className="text-xs font-medium mb-1" style={{ color: "#22C55E" }}>Admin Response</p>
                          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-lg md:text-xl font-bold text-dark">Related Products</h2>
            </div>
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="-mr-[2px] -mb-[2px]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {relatedProducts.map((p) => (
                    <div key={p.id} className="border-r-2 border-b-2 border-gray-200">
                      <ProductTableRow product={p} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
